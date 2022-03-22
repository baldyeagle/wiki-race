import { useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import { Divider, HStack, Icon, IconButton, Text } from 'native-base';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert, Modal, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';


interface WikipediaModalProps {
    showWebview: boolean,
    setShowWebview: (showWebview: boolean) => void,
    clicks: number,
    currentPage: string | null,
    isComplete: boolean,
    navigatePage: () => void,
    showEndDetails: () => void,
}

export const WikipediaModal = ({ showWebview, setShowWebview, clicks, currentPage, navigatePage, isComplete, showEndDetails }: WikipediaModalProps) => {
    const insets = useSafeAreaInsets()

    function AppBar() {
        return (
            <HStack justifyContent="space-between" alignItems="center" w="100%">
                <HStack>
                    <IconButton icon={<Icon as={Entypo} name='cross' size="sm" onPress={() => setShowWebview(false)} />} />
                </HStack>
                <HStack alignItems="center">
                    <Text style={{ textAlign: 'center' }} fontSize="20" fontWeight="bold">
                        {`Clicks = ${clicks}`}
                    </Text>
                </HStack>
                <HStack>
                    <IconButton icon={<Icon as={Entypo} name='help' size="sm" onPress={() => showEndDetails()} />} />
                </HStack>
            </HStack>
        )
    }

    useEffect(() => {
        if (isComplete) {
            Alert.alert(
                'Congratulations!',
                `You finished this Wikipedia race after clicking ${clicks} times!`,
                [{
                    text: 'OK',
                    style: 'cancel',
                }],
                {
                    cancelable: true
                }
            )
        }
    }, [isComplete]);

    return (
        <Modal
            animationType='slide'
            visible={showWebview}
            onRequestClose={() => setShowWebview(false)}
        >
            <View style={{ flex: 1 }} >
                <View style={{ flex: 1, paddingTop: insets.top }}>
                    <AppBar />
                    <Divider />
                    <WebView
                        source={{ uri: currentPage }}
                        allowsBackForwardNavigationGestures={true}
                        allowsLinkPreview={false}
                        contentInset={{ top: -55 }}
                        onLoadStart={navigatePage}
                    />
                </View>
            </View>
        </Modal >
    )
};
