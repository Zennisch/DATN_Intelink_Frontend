import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import TextInput from "./atoms/TextInput";
import Button from "./atoms/Button";

interface UnlockUrlModalProps {
  visible: boolean;
  onClose: () => void;
  onUnlock: (password: string) => Promise<void>;
  loading?: boolean;
  error?: string;
  shortUrl?: string;
}

const UnlockUrlModal: React.FC<UnlockUrlModalProps> = ({
  visible,
  onClose,
  onUnlock,
  loading = false,
  error,
  shortUrl,
}) => {
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const handleUnlock = async () => {
    if (!password || password.length < 4) {
      setLocalError("Mật khẩu phải có ít nhất 4 ký tự");
      return;
    }
    setLocalError(undefined);
    await onUnlock(password);
  };

  const handleClose = () => {
    setPassword("");
    setLocalError(undefined);
    onClose();
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
          <Text className="text-lg font-semibold mb-4 text-gray-900 text-center">
            Unlock Protected URL
          </Text>
          {shortUrl && (
            <Text className="text-center text-blue-600 mb-2">{shortUrl}</Text>
          )}
          <TextInput
            label="Password"
            placeholder="Nhập mật khẩu để mở khóa..."
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            fullWidth
            editable={!loading}
          />
          {(localError || error) && (
            <Text className="text-red-600 mt-2 mb-1 text-sm text-center">{localError || error}</Text>
          )}
          <View className="flex-row justify-end mt-6 space-x-2">
            <TouchableOpacity onPress={handleClose} disabled={loading}>
              <Text className="text-gray-500 px-4 py-2">Cancel</Text>
            </TouchableOpacity>
            <Button
              onPress={handleUnlock}
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              Unlock
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UnlockUrlModal;
