
import React, { useState, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView, Alert, PanResponder, Animated, StyleSheet } from "react-native";
import TextInput from "./atoms/TextInput";
import Button from "./atoms/Button";
import Checkbox from "./atoms/Checkbox";
import type { User } from "../models/User";
import { canCustomizeShortCode } from "../utils/subscriptionUtils";
import { AccessControlSection, type AccessControlData } from "./AccessControlSection";
import { ErrorSuppressor } from "./ErrorSuppressor";
import type { CreateShortUrlRequest } from "../dto/ShortUrlDTO";
import type { AccessControlMode } from "../models/ShortUrl";

interface CustomShortUrlModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (urlData: CreateShortUrlRequest) => Promise<void>;
  loading?: boolean;
  user: User | null;
}

const CustomShortUrlModal: React.FC<CustomShortUrlModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
  user,
}) => {
  const [formData, setFormData] = useState<CreateShortUrlRequest>({
    originalUrl: "",
    customCode: "",
    password: "",
    description: "",
    maxUsage: undefined,
    availableDays: 30,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateShortUrlRequest, string>>>({});
  const [hasPassword, setHasPassword] = useState(false);
  const [hasMaxUsage, setHasMaxUsage] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Access Control state
  const [accessControl, setAccessControl] = useState<AccessControlData>({
    mode: "allow",
    countries: [],
    ipRanges: [],
  });

  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          Animated.timing(translateY, {
            toValue: 1000,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            handleClose();
            translateY.setValue(0);
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const validateForm = (): Partial<Record<keyof CreateShortUrlRequest, string>> => {
    const newErrors: Partial<Record<keyof CreateShortUrlRequest, string>> = {};
    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = "Original URL is required";
    } else {
      try {
        new URL(formData.originalUrl);
      } catch {
        newErrors.originalUrl = "Invalid URL";
      }
    }
    if (hasPassword && (!formData.password || formData.password.length < 4)) {
      newErrors.password = "Password must be at least 4 characters";
    }
    if (hasMaxUsage && (!formData.maxUsage || formData.maxUsage < 1)) {
      newErrors.maxUsage = "Max usage must be greater than 0";
    }
    if (formData.availableDays < 1) {
      newErrors.availableDays = "Available days must be greater than 0";
    }
    return newErrors;
  };

  const handleCreate = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const requestData: CreateShortUrlRequest = {
        originalUrl: formData.originalUrl.trim(),
        customCode: formData.customCode?.trim() || undefined,
        availableDays: formData.availableDays,
        description: formData.description?.trim() || undefined,
        password: hasPassword ? formData.password?.trim() : undefined,
        maxUsage: hasMaxUsage ? formData.maxUsage : undefined,
      };
      
      // Add access control data
      // Only apply access control if there are actual restrictions (countries or IPs)
      if (accessControl.countries.length > 0 || accessControl.ipRanges.length > 0) {
          requestData.accessControlMode = accessControl.mode === 'allow' ? 'WHITELIST' : 'BLACKLIST';
          
          // Only add geographies if there are selected countries
          if (accessControl.countries.length > 0) {
              requestData.accessControlGeographies = accessControl.countries;
          }
          
          // Only add CIDRs if there are selected IP ranges
          if (accessControl.ipRanges.length > 0) {
              requestData.accessControlCIDRs = accessControl.ipRanges;
          }
      } else {
          // If no restrictions are defined, ensure mode is NONE
          requestData.accessControlMode = 'NONE';
      }
      
      await onSubmit(requestData);
      handleClose();
    } catch (e: any) {
      setErrors({ originalUrl: e?.response?.data?.message || "Failed to create short URL" });
    }
  };

  const handleInputChange = (field: keyof CreateShortUrlRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    setFormData({
      originalUrl: "",
      customCode: "",
      password: "",
      description: "",
      maxUsage: undefined,
      availableDays: 30,
    });
    setErrors({});
    setHasPassword(false);
    setHasMaxUsage(false);
    setShowAdvancedOptions(false);
    setAccessControl({
      mode: "allow",
      countries: [],
      ipRanges: [],
    });
    onClose();
  };

  const handlePasswordToggle = (checked: boolean) => {
    setHasPassword(checked);
    if (!checked) {
      setFormData((prev) => ({ ...prev, password: "" }));
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleMaxUsageToggle = (checked: boolean) => {
    setHasMaxUsage(checked);
    if (!checked) {
      setFormData((prev) => ({ ...prev, maxUsage: undefined }));
      setErrors((prev) => ({ ...prev, maxUsage: undefined }));
    }
  };
  
  return (
    <Modal
      key={`modal-${visible}`}
      visible={visible}
      animationType="slide"
      transparent={false}
			onRequestClose={handleClose}
		>
			<Animated.View
					style={[styles.container, { transform: [{ translateY }] }]}
				>
					{/* Drag Handle */}
					<View style={styles.dragHandleContainer}>
						<View {...panResponder.panHandlers} style={styles.dragHandleWrapper}>
							<View style={styles.dragHandle} />
						</View>
					</View>
					
					{/* Header */}
					<View style={styles.header}>
						<Text style={styles.headerText}>
							Create Short URL
						</Text>
					</View>
					
					{/* Scrollable Content */}
					<ScrollView 
					showsVerticalScrollIndicator={true}
					persistentScrollbar={true}
					indicatorStyle="black"
					bounces={true}
					scrollEnabled={true}
					nestedScrollEnabled={true}
					contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 100 }}
					keyboardShouldPersistTaps="handled"
					scrollIndicatorInsets={{ right: 1 }}
				>
            <View className="mb-3">
              <TextInput
                label="Original URL*"
                placeholder="https://example.com/very-long-url..."
                value={formData.originalUrl}
                onChangeText={v => handleInputChange("originalUrl", v)}
                error={errors.originalUrl}
                fullWidth
                autoCapitalize="none"
                keyboardType="url"
                editable={!loading}
              />
            </View>
            <View className="mb-4">
              <TextInput
                label="Custom Short Code"
                placeholder={
                  canCustomizeShortCode(user).allowed 
                    ? "Custom alias (optional)" 
                    : "Upgrade to customize"
                }
                value={formData.customCode || ""}
                onChangeText={v => {
                  const checkResult = canCustomizeShortCode(user);
                  if (!checkResult.allowed) {
                    Alert.alert(
                      'Feature Restricted',
                      checkResult.reason,
                      [{ text: 'OK' }]
                    );
                    return;
                  }
                  handleInputChange("customCode", v);
                }}
                error={errors.customCode}
                fullWidth
                autoCapitalize="none"
                editable={!loading && canCustomizeShortCode(user).allowed}
              />
              {!canCustomizeShortCode(user).allowed && (
                <Text className="text-xs text-gray-500 mt-1">
                  Custom short codes require a paid plan
                </Text>
              )}
            </View>
            <View className="mb-4">
              <TextInput
                label="Description"
                placeholder="Description for this short URL..."
                value={formData.description || ""}
                onChangeText={v => handleInputChange("description", v)}
                fullWidth
                editable={!loading}
              />
            </View>
            <View className="mb-4">
              <TextInput
                label="Available Days*"
                placeholder="30"
                value={formData.availableDays.toString()}
                onChangeText={v => handleInputChange("availableDays", parseInt(v) || 0)}
                error={errors.availableDays}
                fullWidth
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
            <View className="flex-row items-center mt-3 mb-2">
              <Checkbox
                checked={hasPassword}
                onChange={handlePasswordToggle}
                label="Protect with Password"
                disabled={loading}
              />
            </View>
            {hasPassword && (
              <View className="mb-4">
                <TextInput
                  label="Password"
                  placeholder="Enter password"
                  value={formData.password || ""}
                  onChangeText={v => handleInputChange("password", v)}
                  error={errors.password}
                  fullWidth
                  secureTextEntry
                  editable={!loading}
                />
              </View>
            )}
            <View className="flex-row items-center mt-3 mb-2">
              <Checkbox
                checked={hasMaxUsage}
                onChange={handleMaxUsageToggle}
                label="Limit Maximum Usage"
                disabled={loading}
              />
            </View>
            {hasMaxUsage && (
              <View className="mb-4">
                <TextInput
                  label="Max Usage"
                  placeholder="100"
                  value={formData.maxUsage?.toString() || ""}
                  onChangeText={v => handleInputChange("maxUsage", parseInt(v) || 0)}
                  error={errors.maxUsage}
                  fullWidth
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
            )}
            
            {/* Advanced Options Button */}
            <View className="mt-4 mb-3">
              <TouchableOpacity 
                className="bg-gray-100 rounded-lg py-3 px-4"
                disabled={loading}
                onPress={() => setShowAdvancedOptions(!showAdvancedOptions)}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-gray-900 text-center font-medium mr-2">
                    Advanced Options
                  </Text>
                  <Text className="text-gray-900 text-lg">
                    {showAdvancedOptions ? '▲' : '▼'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Advanced Options Section - Collapsible */}
            {showAdvancedOptions && (
              <View className="mb-4 pt-2 border-t border-gray-200">
                <ErrorSuppressor>
                  <AccessControlSection
                    data={accessControl}
                    onChange={setAccessControl}
                  />
                </ErrorSuppressor>
              </View>
            )}

          </ScrollView>
          
          {/* Fixed Footer */}
          <View className="px-6 py-4 border-t border-gray-200 bg-white">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity 
                onPress={handleClose} 
                disabled={loading}
                className="px-6 py-3"
              >
                <Text className="text-gray-600 font-medium">Cancel</Text>
              </TouchableOpacity>
              <Button
                onPress={handleCreate}
                variant="primary"
                loading={loading}
                disabled={!formData.originalUrl.trim() || loading}
              >
                Create Short URL
              </Button>
            </View>
          </View>
        </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	dragHandleContainer: {
		alignItems: 'center',
		paddingVertical: 12,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#F3F4F6',
	},
	dragHandleWrapper: {
		paddingVertical: 8,
		paddingHorizontal: 40,
	},
	dragHandle: {
		width: 48,
		height: 4,
		backgroundColor: '#D1D5DB',
		borderRadius: 9999,
	},
	header: {
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E7EB',
	},
	headerText: {
		fontSize: 20,
		fontWeight: '600',
		color: '#111827',
	},
});

export default CustomShortUrlModal;
