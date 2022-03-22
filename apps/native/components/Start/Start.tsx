import { useEffect, useState } from "react";
import { Center, Divider, Heading, Icon, Text, View } from 'native-base';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from 'axios';
import { Alert, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import { URL } from 'react-native-url-polyfill';
import { RandomPageProps, WikipediaSummary } from "../../types";
import { Entypo } from "@expo/vector-icons";
import { WikipediaModal } from "../WikipediaModal";
import { Button, HelpIcon } from "ui";

const RANDOM_WIKI_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/random/summary;'

export const Start = () => {
    const insets = useSafeAreaInsets();
    const STARTING_CLICKS = 0;
    const [isComplete, setIsComplete] = useState(false);
    const [currentPage, setCurrentPage] = useState<string | null>(null);
    const [clicks, setClicks] = useState(STARTING_CLICKS);
    const [randomStart, setRandomStart] = useState<WikipediaSummary | null>(null);
    const [randomEnd, setRandomEnd] = useState<WikipediaSummary | null>(null);
    const [showWebview, setShowWebview] = useState(false);

    const getRandomPage: () => Promise<WikipediaSummary> = async () => {
        const response = await axios.get(RANDOM_WIKI_API_URL, { headers: { 'accept': 'application/json' } });
        return await response.data;
    };

    useEffect(() => {
        refreshPages();
    }, []);

    useEffect(() => {
        setCurrentPage(randomStart?.content_urls?.mobile?.page ?? null)
    }, [randomStart]);

    const refreshPages: () => void = () => {
        setClicks(STARTING_CLICKS);
        setIsComplete(false);
        getRandomPage().then(res => setRandomStart(res));
        getRandomPage().then(res => setRandomEnd(res));
    };

    const navigatePage = (syntheticEvent: WebViewNavigationEvent) => {
        const { nativeEvent } = syntheticEvent;
        const pageURL = new URL(nativeEvent.url);
        console.log(JSON.parse(JSON.stringify(nativeEvent)));
        // Check for image
        if (pageURL.href.match(/\.(jpeg|jpg|gif|png|svg)$/) !== null) {
            return;
        }
        setCurrentPage(pageURL.href)
        if (!isComplete && pageURL.href !== randomStart?.content_urls?.mobile?.page) {
            setClicks(clicks + 1);
        }
        if (pageURL.href === randomEnd?.content_urls?.mobile?.page) {
            setIsComplete(true);
        }
    };

    const showMoreStartAlert = () => {
        Alert.alert(
            `Start: ${randomStart?.title ?? 'More details'}`,
            randomStart?.extract ?? 'No text extract available',
            [{
                text: 'OK',
                style: 'cancel',
            }],
            {
                cancelable: true
            }
        )
    };

    const showMoreEndAlert = () => {
        Alert.alert(
            `End: ${randomEnd?.title ?? 'More details'}`,
            randomEnd?.extract ?? 'No text extract available',
            [{
                text: 'OK',
                style: 'cancel',
            }],
            {
                cancelable: true
            }
        )
    };

    const RandomPage = ({ order, page, openPageDetails }: RandomPageProps) => {
        return (
            <View style={{ flex: 4, alignContent: 'flex-start', justifyContent: 'flex-start', marginVertical: 4 }}>
                <Heading style={{ textAlign: 'center' }} fontSize="md">{order.toUpperCase()}</Heading>
                <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Text style={{ textAlign: 'center' }} mx={2} fontSize="md">{page?.title}</Text>
                    <HelpIcon onPress={openPageDetails} />
                </View>
                <View style={styles.imageContainer}>
                    {page?.thumbnail &&
                        <Image
                            style={{
                                width: page?.thumbnail.width,
                                height: page?.thumbnail.height,
                                resizeMode: 'contain',
                                maxHeight: '100%',
                            }}
                            source={{ uri: page?.thumbnail.source }}
                        />
                    }
                </View>
            </View>
        )
    };

    const RefreshIcon = <Icon as={Entypo} name="cycle" />
    const StartIcon = <Icon as={Entypo} name="chevron-right" />

    return (
        <Center flex={1} style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <StatusBar style="auto" />
            {showWebview &&
                <WikipediaModal
                    showWebview={showWebview}
                    clicks={clicks}
                    setShowWebview={setShowWebview}
                    currentPage={currentPage}
                    navigatePage={navigatePage}
                    isComplete={isComplete}
                    showEndDetails={showMoreEndAlert}
                />
            }
            <Divider orientation='horizontal' />
            <RandomPage order='start' page={randomStart} openPageDetails={showMoreStartAlert} />
            <Divider orientation='horizontal' />
            <RandomPage order='end' page={randomEnd} openPageDetails={showMoreEndAlert} />
            <Divider orientation='horizontal' />
            <View style={{ flexBasis: '10%', justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row' }}>
                <Button style={{ flex: 1, flexBasis: '40%', marginHorizontal: 16 }} leftIcon={RefreshIcon} onPress={() => refreshPages()}>REFRESH</Button>
                <Button style={{ flex: 1, flexBasis: '40%', marginHorizontal: 16 }} endIcon={StartIcon} onPress={() => setShowWebview(true)}>START</Button>
            </View>
        </Center>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        flexBasis: '45%',
        flexGrow: 1,
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
