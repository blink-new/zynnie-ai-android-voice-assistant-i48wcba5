import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Mic, 
  Shield, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ChevronRight 
} from 'lucide-react-native';

interface Permission {
  id: string;
  title: string;
  description: string;
  type: 'microphone' | 'accessibility' | 'device_admin';
  status: 'granted' | 'denied' | 'not_requested';
  required: boolean;
}

interface PermissionCardProps {
  permission: Permission;
  onPress: () => void;
}

export const PermissionCard: React.FC<PermissionCardProps> = ({ 
  permission, 
  onPress 
}) => {
  const getIcon = (type: string) => {
    const iconProps = { size: 24, color: '#6366F1' };
    
    switch (type) {
      case 'microphone': return <Mic {...iconProps} />;
      case 'accessibility': return <Shield {...iconProps} />;
      case 'device_admin': return <Settings {...iconProps} />;
      default: return <Shield {...iconProps} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'granted': 
        return <CheckCircle size={20} color="#10B981" />;
      case 'denied': 
        return <AlertCircle size={20} color="#EF4444" />;
      default: 
        return <ChevronRight size={20} color="#6B7280" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'granted': return 'Granted';
      case 'denied': return 'Denied';
      default: return 'Not Requested';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'granted': return '#10B981';
      case 'denied': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.card}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {getIcon(permission.type)}
          </View>
          
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{permission.title}</Text>
              {permission.required && (
                <View style={styles.requiredBadge}>
                  <Text style={styles.requiredText}>REQUIRED</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.description} numberOfLines={2}>
              {permission.description}
            </Text>
            
            <View style={styles.statusRow}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(permission.status) }
              ]}>
                <Text style={styles.statusText}>
                  {getStatusText(permission.status)}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.actionContainer}>
            {getStatusIcon(permission.status)}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  requiredText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});