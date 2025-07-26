import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Smartphone, 
  Download, 
  Trash2, 
  Play, 
  X, 
  MessageCircle,
  Clock 
} from 'lucide-react-native';

interface Command {
  id: string;
  text: string;
  timestamp: Date;
  action: string;
  status: 'completed' | 'pending' | 'failed';
}

interface CommandCardProps {
  command: Command;
  onPress?: () => void;
}

export const CommandCard: React.FC<CommandCardProps> = ({ command, onPress }) => {
  const getActionIcon = (action: string) => {
    const iconProps = { size: 20, color: '#FFFFFF' };
    
    switch (action) {
      case 'open_app': return <Play {...iconProps} />;
      case 'download_app': return <Download {...iconProps} />;
      case 'delete_app': return <Trash2 {...iconProps} />;
      case 'close_app': return <X {...iconProps} />;
      case 'wake_word': return <MessageCircle {...iconProps} />;
      default: return <Smartphone {...iconProps} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'open_app': return ['#10B981', '#059669'];
      case 'download_app': return ['#3B82F6', '#2563EB'];
      case 'delete_app': return ['#EF4444', '#DC2626'];
      case 'close_app': return ['#F59E0B', '#D97706'];
      case 'wake_word': return ['#8B5CF6', '#7C3AED'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'failed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatAction = (action: string) => {
    return action.replace('_', ' ').toUpperCase();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.card}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={getActionColor(command.action)}
            style={styles.iconContainer}
          >
            {getActionIcon(command.action)}
          </LinearGradient>
          
          <View style={styles.headerText}>
            <Text style={styles.actionType}>{formatAction(command.action)}</Text>
            <View style={styles.timeContainer}>
              <Clock size={12} color="#94A3B8" />
              <Text style={styles.timestamp}>{formatTime(new Date(command.timestamp))}</Text>
            </View>
          </View>
          
          <View style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(command.status) }
          ]}>
            <Text style={styles.statusText}>{command.status.toUpperCase()}</Text>
          </View>
        </View>
        
        <Text style={styles.commandText} numberOfLines={2}>
          "{command.text}"
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  actionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  commandText: {
    fontSize: 16,
    color: '#E2E8F0',
    fontStyle: 'italic',
    lineHeight: 22,
  },
});