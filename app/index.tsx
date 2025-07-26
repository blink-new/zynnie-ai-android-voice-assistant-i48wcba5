import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

interface Command {
  id: string;
  text: string;
  timestamp: Date;
  action: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function ZynnieAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isWakeWordActive, setIsWakeWordActive] = useState(true);
  const [currentCommand, setCurrentCommand] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [commands, setCommands] = useState<Command[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [zynnieResponse, setZynnieResponse] = useState('');
  const [activeTab, setActiveTab] = useState('assistant');

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startListening = () => {
    setIsListening(true);
    setCurrentCommand('Listening...');
    
    // Simulate voice recognition with Hindi and English commands
    setTimeout(() => {
      const mockCommands = [
        'Open Instagram',
        'Open YouTube',
        'Instagram kholo',
        'YouTube chalu karo',
        'Download Snapchat',
        'Snapchat download karo',
        'Delete Facebook',
        'Facebook delete kar do',
        'Close YouTube',
        'YouTube band kar do',
        'Call Mom',
        'Mummy ko call karo',
        'Play music',
        'Gaana bajao',
        'Turn on flashlight',
        'Torch on kar do',
        'Battery kitna hai?',
        'What time is it?',
        'Samay kya hai?',
        'Set alarm for 5 AM',
        '5 baje alarm laga do',
        'Brightness kam karo',
        'WiFi off kar do',
        'Hey Zynnie, what can you do?',
        'Hey Zynnie, kya kar sakti ho?',
      ];
      const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
      setCurrentCommand(randomCommand);
      processVoiceCommand(randomCommand);
      setIsListening(false);
    }, 3000);
  };

  // Enhanced command processing with Hindi and English support
  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Wake word detection
    if (lowerCommand.includes('hey zynnie')) {
      handleWakeWord(command);
      return;
    }

    // App opening commands (Hindi + English)
    if (lowerCommand.includes('open') || lowerCommand.includes('kholo') || lowerCommand.includes('chalu karo')) {
      if (lowerCommand.includes('instagram')) {
        handleOpenApp('Instagram', "Okay, opening Instagram now.");
      } else if (lowerCommand.includes('youtube')) {
        handleOpenApp('YouTube', "Got it, opening YouTube now.");
      } else if (lowerCommand.includes('whatsapp')) {
        handleOpenApp('WhatsApp', "Opening WhatsApp right away.");
      } else if (lowerCommand.includes('facebook')) {
        handleOpenApp('Facebook', "Opening Facebook now.");
      } else if (lowerCommand.includes('camera')) {
        handleOpenApp('Camera', "Camera is ready.");
      } else if (lowerCommand.includes('phone') || lowerCommand.includes('call')) {
        handleOpenApp('Phone', "Opening phone app.");
      } else {
        const appName = extractAppName(command);
        handleOpenApp(appName, `Opening ${appName} now.`);
      }
    }
    // App downloading commands (Hindi + English)
    else if (lowerCommand.includes('download') || lowerCommand.includes('install') || lowerCommand.includes('download karo')) {
      if (lowerCommand.includes('snapchat')) {
        handleDownloadApp('Snapchat', "Got it, downloading Snapchat from Play Store.");
      } else if (lowerCommand.includes('whatsapp')) {
        handleDownloadApp('WhatsApp', "Sure, downloading WhatsApp from Play Store.");
      } else {
        const appName = extractAppName(command);
        handleDownloadApp(appName, `Downloading ${appName} from Play Store.`);
      }
    }
    // App deletion commands (Hindi + English)
    else if (lowerCommand.includes('delete') || lowerCommand.includes('uninstall') || lowerCommand.includes('delete kar') || lowerCommand.includes('hatao')) {
      if (lowerCommand.includes('facebook')) {
        handleDeleteApp('Facebook', "Just to confirm, should I uninstall Facebook?");
      } else if (lowerCommand.includes('whatsapp')) {
        handleDeleteApp('WhatsApp', "Got it, uninstalling WhatsApp for you.");
      } else {
        const appName = extractAppName(command);
        handleDeleteApp(appName, `Just to confirm, should I uninstall ${appName}?`);
      }
    }
    // App closing commands (Hindi + English)
    else if (lowerCommand.includes('close') || lowerCommand.includes('band kar') || lowerCommand.includes('band karo')) {
      if (lowerCommand.includes('youtube')) {
        handleCloseApp('YouTube', "Got it, closing YouTube now.");
      } else {
        const appName = extractAppName(command);
        handleCloseApp(appName, `Closing ${appName} now.`);
      }
    }
    // Call commands (Hindi + English)
    else if (lowerCommand.includes('call') || lowerCommand.includes('phone kar') || lowerCommand.includes('call karo')) {
      if (lowerCommand.includes('mom') || lowerCommand.includes('mummy') || lowerCommand.includes('mama')) {
        handleCallCommand('Mom', "Calling Mom now.");
      } else if (lowerCommand.includes('dad') || lowerCommand.includes('papa')) {
        handleCallCommand('Dad', "Calling Dad now.");
      } else {
        handleCallCommand('Contact', "Opening phone to make a call.");
      }
    }
    // Music commands (Hindi + English)
    else if (lowerCommand.includes('play music') || lowerCommand.includes('gaana bajao') || lowerCommand.includes('music chalu karo')) {
      handleMusicCommand('play', "Sure thing, starting your music now.");
    } else if (lowerCommand.includes('stop music') || lowerCommand.includes('gaana band karo') || lowerCommand.includes('music stop karo')) {
      handleMusicCommand('stop', "Done, music stopped.");
    }
    // Flashlight commands (Hindi + English)
    else if (lowerCommand.includes('turn on flashlight') || lowerCommand.includes('flashlight on') || lowerCommand.includes('torch on kar') || lowerCommand.includes('torch chalu karo')) {
      handleFlashlightCommand('on', "Flashlight is on.");
    } else if (lowerCommand.includes('turn off flashlight') || lowerCommand.includes('flashlight off') || lowerCommand.includes('torch off kar') || lowerCommand.includes('torch band karo')) {
      handleFlashlightCommand('off', "Flashlight is off.");
    }
    // Device settings commands (Hindi + English)
    else if (lowerCommand.includes('brightness kam karo') || lowerCommand.includes('brightness down') || lowerCommand.includes('dim screen')) {
      handleBrightnessCommand('down', "Brightness decreased.");
    } else if (lowerCommand.includes('brightness badha') || lowerCommand.includes('brightness up') || lowerCommand.includes('bright screen')) {
      handleBrightnessCommand('up', "Brightness increased.");
    } else if (lowerCommand.includes('wifi off kar') || lowerCommand.includes('wifi band karo') || lowerCommand.includes('turn off wifi')) {
      handleWifiCommand('off', "WiFi turned off.");
    } else if (lowerCommand.includes('wifi on kar') || lowerCommand.includes('wifi chalu karo') || lowerCommand.includes('turn on wifi')) {
      handleWifiCommand('on', "WiFi turned on.");
    }
    // Alarm commands (Hindi + English)
    else if (lowerCommand.includes('set alarm') || lowerCommand.includes('alarm laga') || lowerCommand.includes('alarm set kar')) {
      if (lowerCommand.includes('5 am') || lowerCommand.includes('5 baje')) {
        handleAlarmCommand('5:00 AM', "Alarm set for 5 AM.");
      } else if (lowerCommand.includes('6 am') || lowerCommand.includes('6 baje')) {
        handleAlarmCommand('6:00 AM', "Alarm set for 6 AM.");
      } else {
        handleAlarmCommand('Morning', "Alarm has been set.");
      }
    }
    // Device information commands (Hindi + English)
    else if (lowerCommand.includes('what time') || lowerCommand.includes('time') || lowerCommand.includes('samay kya hai') || lowerCommand.includes('time kya hai')) {
      handleTimeQuery();
    } else if (lowerCommand.includes('battery') || lowerCommand.includes('battery kitna hai') || lowerCommand.includes('charge kitna hai')) {
      handleBatteryQuery();
    } else if (lowerCommand.includes('wifi') || lowerCommand.includes('wi-fi') || lowerCommand.includes('internet')) {
      handleWifiQuery();
    }
    // Help commands (Hindi + English)
    else if (lowerCommand.includes('what can you do') || lowerCommand.includes('help') || lowerCommand.includes('kya kar sakti ho') || lowerCommand.includes('madad karo')) {
      handleHelpQuery();
    }
    // Fallback for unrecognized commands
    else {
      handleUnknownCommand();
    }
  };

  const extractAppName = (command: string): string => {
    const words = command.split(' ');
    // Find app name after action words
    const actionWords = ['open', 'kholo', 'chalu', 'download', 'delete', 'close', 'band', 'install', 'uninstall'];
    for (let i = 0; i < words.length; i++) {
      if (actionWords.some(action => words[i].toLowerCase().includes(action))) {
        if (i + 1 < words.length) {
          return words[i + 1];
        }
      }
    }
    return 'App';
  };

  const handleWakeWord = (command: string) => {
    setZynnieResponse("I'm listening...");
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: command,
      timestamp: new Date(),
      action: 'wake_word',
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleOpenApp = (appName: string, response: string) => {
    setZynnieResponse(response);
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: 'open_app',
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleDownloadApp = (appName: string, response: string) => {
    setZynnieResponse(response);
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: 'download_app',
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleDeleteApp = (appName: string, response: string) => {
    if (response.includes('Just to confirm')) {
      // Show confirmation for sensitive deletions
      const action = {
        type: 'delete_app',
        appName,
        description: `Uninstall ${appName}`,
        response,
      };
      setPendingAction(action);
      setShowConfirmation(true);
    } else {
      // Direct deletion for some apps
      setZynnieResponse(response);
      const newCommand: Command = {
        id: Date.now().toString(),
        text: currentCommand,
        timestamp: new Date(),
        action: 'delete_app',
        status: 'completed',
      };
      setCommands(prev => [newCommand, ...prev]);
    }
  };

  const handleCloseApp = (appName: string, response: string) => {
    setZynnieResponse(response);
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: 'close_app',
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleCallCommand = (contact: string, response: string) => {
    setZynnieResponse(response);
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: 'make_call',
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleMusicCommand = (action: string, response: string) => {
    setZynnieResponse(response);
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: `music_${action}`,
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleFlashlightCommand = (action: string, response: string) => {
    setZynnieResponse(response);
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: `flashlight_${action}`,
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleBrightnessCommand = (action: string, response: string) => {
    setZynnieResponse(response);
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: `brightness_${action}`,
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleWifiCommand = (action: string, response: string) => {
    setZynnieResponse(response);
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: `wifi_${action}`,
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleAlarmCommand = (time: string, response: string) => {
    setZynnieResponse(response);
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: 'set_alarm',
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleTimeQuery = () => {
    const currentTime = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    const response = `It's ${currentTime}.`;
    setZynnieResponse(response);
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: 'time_query',
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleBatteryQuery = () => {
    const batteryLevel = Math.floor(Math.random() * 40) + 50; // Random 50-90%
    const response = `Battery is at ${batteryLevel}%.`;
    setZynnieResponse(response);
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: 'battery_query',
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleWifiQuery = () => {
    setZynnieResponse("Yes, you're connected to Wi-Fi.");
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: 'wifi_query',
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleHelpQuery = () => {
    setZynnieResponse("I can open, install, or delete apps, play music, answer questions, and help with your device. Just ask!");
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: 'help_query',
      status: 'completed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleUnknownCommand = () => {
    setZynnieResponse("Sorry, I didn't catch that. Please repeat.");
    
    const newCommand: Command = {
      id: Date.now().toString(),
      text: currentCommand,
      timestamp: new Date(),
      action: 'unknown_command',
      status: 'failed',
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const executeAction = async () => {
    if (!pendingAction) return;

    try {
      let response = '';

      switch (pendingAction.type) {
        case 'delete_app':
          response = `Got it, uninstalling ${pendingAction.appName}.`;
          break;
        default:
          response = pendingAction.response || 'Action completed.';
          break;
      }

      setZynnieResponse(response);

      const newCommand: Command = {
        id: Date.now().toString(),
        text: currentCommand,
        timestamp: new Date(),
        action: pendingAction.type,
        status: 'completed',
      };
      setCommands(prev => [newCommand, ...prev]);

    } catch (error) {
      console.error('Action execution failed:', error);
      setZynnieResponse('Sorry, I encountered an error executing that command.');
    }

    setShowConfirmation(false);
    setPendingAction(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderAssistant = () => (
    <View style={styles.assistantContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Zynnie</Text>
        <Text style={styles.subtitle}>AI Voice Assistant</Text>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, { backgroundColor: isWakeWordActive ? '#10B981' : '#EF4444' }]} />
          <Text style={styles.statusText}>
            {isWakeWordActive ? 'Wake word active' : 'Wake word inactive'}
          </Text>
        </View>
      </View>

      {/* Voice Button */}
      <View style={styles.voiceSection}>
        <TouchableOpacity
          style={styles.micButton}
          onPress={startListening}
          disabled={isListening}
        >
          <Animated.View style={[styles.micButtonInner, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.micIcon}>{isListening ? '🎤' : '🎙️'}</Text>
          </Animated.View>
        </TouchableOpacity>
        
        {/* Voice Visualizer */}
        {isListening && (
          <View style={styles.visualizer}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={[styles.visualizerBar, { height: Math.random() * 30 + 10 }]} />
            ))}
          </View>
        )}
      </View>

      {/* Current Command Display */}
      <View style={styles.commandDisplay}>
        <Text style={styles.commandText}>{currentCommand || 'Say "Hey Zynnie" to start'}</Text>
        {zynnieResponse ? (
          <Text style={styles.responseText}>Zynnie: "{zynnieResponse}"</Text>
        ) : null}
      </View>

      {/* Language Support Info */}
      <View style={styles.languageInfo}>
        <Text style={styles.languageText}>🌐 Supports Hindi & English</Text>
        <Text style={styles.languageSubtext}>Try: "Instagram kholo" or "Open Instagram"</Text>
      </View>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.historyContent}>
      <Text style={styles.sectionTitle}>Command History</Text>
      <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
        {commands.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🧠</Text>
            <Text style={styles.emptyStateTitle}>No Commands Yet</Text>
            <Text style={styles.emptyStateText}>
              Start by saying "Hey Zynnie" or tap the mic button to give your first voice command in Hindi or English.
            </Text>
          </View>
        ) : (
          commands.map((command) => (
            <View key={command.id} style={styles.commandCard}>
              <View style={styles.commandCardHeader}>
                <Text style={styles.commandAction}>{command.action.replace('_', ' ').toUpperCase()}</Text>
                <Text style={styles.commandTime}>{formatTime(new Date(command.timestamp))}</Text>
              </View>
              <Text style={styles.commandCardText}>"{command.text}"</Text>
              <View style={[styles.statusBadge, { 
                backgroundColor: command.status === 'completed' ? '#10B981' : 
                               command.status === 'pending' ? '#F59E0B' : '#EF4444' 
              }]}>
                <Text style={styles.statusBadgeText}>{command.status.toUpperCase()}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.settingsContent}>
      <Text style={styles.sectionTitle}>Settings</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Wake Word Detection</Text>
          <Text style={styles.settingSubtext}>
            Enable "Hey Zynnie" for hands-free activation
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.toggle, { backgroundColor: isWakeWordActive ? '#6366F1' : '#6B7280' }]}
          onPress={() => setIsWakeWordActive(!isWakeWordActive)}
        >
          <View style={[
            styles.toggleThumb,
            { transform: [{ translateX: isWakeWordActive ? 20 : 0 }] }
          ]} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Hindi Language Support</Text>
          <Text style={styles.settingSubtext}>
            Understand Hindi and English commands
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.toggle, { backgroundColor: '#6366F1' }]}
        >
          <View style={[
            styles.toggleThumb,
            { transform: [{ translateX: 20 }] }
          ]} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Voice Feedback</Text>
          <Text style={styles.settingSubtext}>
            Zynnie speaks responses aloud
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.toggle, { backgroundColor: '#6366F1' }]}
        >
          <View style={[
            styles.toggleThumb,
            { transform: [{ translateX: 20 }] }
          ]} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About Zynnie</Text>
        <Text style={styles.aboutText}>
          Version 2.0.0{'\n'}
          AI Voice Assistant for Android{'\n'}
          Hindi & English Support{'\n'}
          Built with privacy in mind
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background */}
      <View style={styles.background} />

      {/* Main Content */}
      <View style={styles.content}>
        {activeTab === 'assistant' && renderAssistant()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'settings' && renderSettings()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'assistant' && styles.navButtonActive]}
          onPress={() => setActiveTab('assistant')}
        >
          <Text style={styles.navIcon}>🎙️</Text>
          <Text style={[styles.navText, activeTab === 'assistant' && styles.navTextActive]}>Assistant</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'history' && styles.navButtonActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={styles.navIcon}>📜</Text>
          <Text style={[styles.navText, activeTab === 'history' && styles.navTextActive]}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'settings' && styles.navButtonActive]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={[styles.navText, activeTab === 'settings' && styles.navTextActive]}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent
        animationType="fade"
      >
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmationTitle}>Zynnie says:</Text>
            <Text style={styles.confirmationText}>
              "{pendingAction?.response || pendingAction?.description}"
            </Text>
            
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.cancelButton]}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmationButton, styles.approveButton]}
                onPress={executeAction}
              >
                <Text style={styles.approveButtonText}>✓ Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  assistantContent: {
    flex: 1,
  },
  historyContent: {
    flex: 1,
  },
  settingsContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#94A3B8',
    marginBottom: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#64748B',
  },
  voiceSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  micButtonInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    fontSize: 40,
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 40,
  },
  visualizerBar: {
    width: 4,
    backgroundColor: '#6366F1',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  commandDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  commandText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  responseText: {
    fontSize: 16,
    color: '#F59E0B',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  languageInfo: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
    marginBottom: 4,
  },
  languageSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 32,
  },
  commandCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  commandCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commandAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  commandTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  commandCardText: {
    fontSize: 16,
    color: '#E2E8F0',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  aboutSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 22,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navButtonActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 12,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  confirmationOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmationModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: width - 48,
    maxWidth: 400,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  confirmationText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmationButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  approveButton: {
    backgroundColor: '#6366F1',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  approveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});