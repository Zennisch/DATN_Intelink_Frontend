
import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import TextInput from "./atoms/TextInput";
import Button from "./atoms/Button";
import Checkbox from "./atoms/Checkbox";

export interface CreateShortUrlRequest {
  originalUrl: string;
  customCode?: string;
  password?: string;
  description?: string;
  maxUsage?: number;
  availableDays: number;
}

interface CustomShortUrlModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (urlData: CreateShortUrlRequest) => Promise<void>;
  loading?: boolean;
}

const CustomShortUrlModal: React.FC<CustomShortUrlModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
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
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-lg font-semibold mb-6 text-gray-900">
              Create Short URL
            </Text>
            <View className="mb-4">
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
                placeholder="Custom alias (optional)"
                value={formData.customCode || ""}
                onChangeText={v => handleInputChange("customCode", v)}
                error={errors.customCode}
                fullWidth
                autoCapitalize="none"
                editable={!loading}
              />
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

            <View className="flex-row justify-end mt-3 space-x-2">
              <TouchableOpacity onPress={handleClose} disabled={loading}>
                <Text className="text-gray-500 px-4 py-2">Cancel</Text>
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CustomShortUrlModal;
