import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, CardItem, Body } from 'native-base';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import * as DraftActions from '../store/actions/DraftActions'; 

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const UpdateDraftScreen = ({ navigation, route }) => {
    const user = useSelector(state => state.UserReducer.user);

    const { draftId, draftUserId, draftTitle, draftImage } = route.params;

    const [title, setTitle] = useState(draftTitle);
    const [image, setImage] = useState(draftImage);

    const [isDrafting, setIsDrafting] = useState(false);
    const [isCreated, setIsCreated] = useState(false);
    const [isError, setIsError] = useState(false);

    const launchCamera = ()  => {
        let options = {
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
        };
        
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
            
                setImage(source.uri);
            }
        });
    };

    const launchImageLibrary = () => {
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };

                setImage(source.uri);
            }
        });
    
    }

    const dispatch = useDispatch();

    const updateDraft = async () => {
        setIsDrafting(true);
        try {
            await dispatch(DraftActions.updateDraft(draftId, draftUserId, title, image, new Date().toString()));
            setIsCreated(true);
        } catch (error) {
            setIsError(true);
        }
    };

    const onError = () => {
        setIsError(false);
        setIsCreated(false);
        setIsDrafting(false);
    };

    const onNavigate = () => {
        navigation.navigate('home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.firstContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.brushContainer}>
                    <Ionicons name='ios-close' style={styles.brushText} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...styles.PostContainer }}>
                    <Text style={styles.postText}>
                        Post
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={updateDraft} style={styles.PostContainer}>
                    <Text style={styles.postText}>
                        Update Draft
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
            <View style={styles.secondContainer}>
                <View style={{ flexDirection: 'row' }}>
                    { user != null && user.hasOwnProperty('user_profile_photo_path') ?
                        <Image source={{ uri: `${user.user_profile_photo_path}` }} style={styles.imgFront} />
                    :
                        <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.imgFront} />
                    }
                    <TextInput 
                        multiline={true}
                        autoCorrect={false}
                        autoFocus
                        placeholder="What's happening?"
                        style={styles.input}
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                    />
                </View>
                { image != '' &&
                    <>
                        <Image source={{ uri: `${image}` }} style={styles.img} />
                        <TouchableOpacity onPress={() => setImage('')} style={styles.imgIconContainer}>
                            <Ionicons name='ios-close' style={styles.imgIcon} />
                        </TouchableOpacity>
                    </>
                }
            </View>
            <View style={styles.cameraMainContainer}>
                <TouchableOpacity onPress={launchCamera} style={styles.cameraContainer}>
                    <Feather name='camera' style={styles.cameraIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={launchImageLibrary} style={styles.cameraContainer}>
                    <FontAwesome name='image' style={styles.cameraIcon} />
                </TouchableOpacity>
            </View>
            <Modal isVisible={isDrafting} hasBackdrop={true} animationIn="fadeIn" animationOut="fadeOut" backdropTransitionOutTiming={0}>
                    <View style={styles.modalCardView}>
                        { !isCreated ? 
                            <ActivityIndicator size='large' color='white' />
                        :
                            <Card style={styles.modalCardContainer}>
                                <CardItem style={styles.modalCardItem}>
                                    <Body style={styles.modalPortfolio}>
                                        <Text style={styles.modalPortfolioText}>
                                            {isError ? 'An Error Occured' : 'Draft Updated'}
                                        </Text>
                                        <TouchableOpacity 
                                            onPress={isError ? onError : onNavigate}  
                                            activeOpacity={0.6} 
                                            style={styles.modalCardButtonContainer}
                                        >
                                            <Text style={styles.modalCardButtonText}>
                                                {isError ? 'Try Again' : 'Go To Main Screen'}
                                            </Text>
                                        </TouchableOpacity>
                                    </Body>
                                </CardItem>
                            </Card>
                        }
                    </View>
                </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    firstContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    brushContainer: {
        width: wp('12%'),
        height: hp('6%'),
        marginLeft: wp(5),
        marginTop: hp(1),
        alignItems: 'center'
    },
    brushText: { 
        color: '#2C7BBF', 
        fontSize: hp(7),
    },
    PostContainer: {
        marginTop: hp(1.5),
        borderWidth: 1,
        marginRight: wp(3),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#00acee',
        borderColor: '#00acee',
        height: hp(6)
    },
    postText: {
        color: 'white', 
        fontSize: hp(2.8),
        paddingHorizontal: 8,
        fontFamily: medium
    },
    secondContainer: { 
        flex: 1, 
        marginTop: hp(2) 
    },
    imgFront: {
        width: wp('13%'),
        height: hp('6.5%'),
        borderRadius: wp('30%'),
        borderColor: '#D9D9D9',
        borderWidth: wp(.5),
        marginLeft: wp(3),
        marginTop: hp(1)
    },
    input: { 
        color: 'rgba(0, 0, 0, .9)', 
        width: wp(80), 
        fontSize: 23, 
        marginLeft: wp(2),
        fontFamily: book  
    },
    cameraMainContainer: { 
        flexDirection: 'row', 
        alignSelf: 'flex-end', 
        width: wp(100), 
        marginBottom: hp(2) 
    },
    cameraContainer: { 
        width: wp(20), 
        alignItems: 'center', 
        marginLeft: wp(2.5), 
        height: hp(9), 
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: .9,
        borderColor: 'black' 
    },
    cameraIcon: {
        color: 'rgba(0 , 0 , 0, .7)', 
        fontSize: hp(5),
    },
    img: { 
        width: wp(50), 
        height: hp(40),
        resizeMode: 'cover', 
        alignSelf: 'flex-end',
        margin: 12,
        borderWidth: 1,
        borderRadius: 25,
        overflow: 'hidden' 
    },
    imgIconContainer: { 
        width: 35,
        height:  35,
        alignItems: 'center', 
        backgroundColor: 'rgba(0, 0, 0, .15)', 
        borderRadius: 17.5, 
        justifyContent: 'center', 
        alignSelf: 'flex-end', 
        marginRight: wp(6), 
        marginTop: hp(-40) 
    },
    imgIcon: { 
        color: 'white', 
        fontSize: hp(5) 
    },
    modalCardContainer: { 
        width: wp('80%'), 
        height: hp(17.5), 
        justifyContent: 'center', 
        backgroundColor: '#F3F3F3' 
    },
    modalCardItem: { 
        backgroundColor: '#F3F3F3' 
    },
    modalPortfolio: { 
        alignItems: 'center', 
        backgroundColor: '#F3F3F3' 
    },
    modalPortfolioText: { 
        fontSize: hp(3), 
        fontFamily: medium, 
        color: '#595959' 
    },
    modalCardButtonText: { 
        color: 'white', 
        fontSize: hp(3), 
        fontFamily: book, 
        padding: 5, 
        paddingHorizontal: 10 
    },
    modalCardButtonContainer: { 
        marginTop: hp(2.5), 
        borderWidth: 1, 
        backgroundColor: '#A6A6A6', 
        borderColor: '#A6A6A6' 
    },
    modalCardView: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center' 
    }
})

export default UpdateDraftScreen;