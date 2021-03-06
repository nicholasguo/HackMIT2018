import React from 'react';
import {
    ActivityIndicator,
    Alert,
    AsyncStorage,
    Image,
    StatusBar,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    PixelRatio, Text
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Font } from 'expo';
import Button from 'react-native-button'

export class ProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        if (navigation.getParam('userToken', 'None') == navigation.getParam('user', 'None'))
            return {
                title: 'Profile',
                headerTitleStyle: {fontFamily: 'montserrat'},
                headerLeft: (
                    <Button
                        style={{fontFamily: 'montserrat', paddingLeft: 10}}
                        onPress={() => navigation.goBack()}>
                        Back
                    </Button>
                ),
                headerRight: (
                    <Button
                        style={{fontFamily: 'montserrat', paddingRight: 10}}
                        onPress={async () => {
                            navigation.navigate('EditProfile', navigation.state.params);
                        }}>
                        Edit
                    </Button>
                ),
            };
        return {
            title: 'Profile',
            headerTitleStyle: {fontFamily: 'montserrat'},
            headerLeft: (
                <Button
                    style={{fontFamily: 'montserrat', paddingLeft: 10}}
                    onPress={() => navigation.goBack()}>
                    Back
                </Button>
            ),
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {user: navigation.getParam('user', 'None'), isLoading: true};
    }

    async getProfile() {
        let response = await fetch('http://hackmit-degrees.herokuapp.com/get_profile?'
            + 'username=' + this.state.user
        );
        let responseJson = await response.json();
        this.setState(responseJson);
        this.props.navigation.state.params.isLoading = false;
    }

    async componentDidMount(){
        await this.getProfile();
        console.log(this.state)
    }

    async componentDidUpdate(){
        if (this.props.navigation.getParam('isLoading')) {
            await this.getProfile();
        }
    }

    render() {
        if (this.props.navigation.getParam('isLoading')) {
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <View style={{flex: 2, justifyContent: 'space-around'}}>
                    <Text style={[styles.input, {fontSize: 30}]}>{this.state.name}</Text>
                    <Text style={[styles.input]}>username: {this.state.user}</Text>
                    <Text style={[styles.input]}>email: {this.state.email}</Text>
                </View>
                <View style={{flex: 3.5, justifyContent: 'center'}}>
                    <Image
                        style={{width: 200, height: 200, borderRadius: 200/2, borderWidth: 2}}
                        source={{uri: this.state.image}}
                    />
                </View>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                    <Text style={[styles.input]}>Color:   </Text>
                    <View
                        style={{width: 30, height: 30, borderWidth: 1, borderRadius: 50/2, backgroundColor: this.state.color}}
                    />
                </View>

                <StatusBar barStyle="default" />
            </View>
        );
    }

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };
}

export class EditProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('newUser', false) ? 'Create your profile' : 'Edit your profile',
            headerTitleStyle: {fontFamily: 'montserrat'},
            headerLeft: (
                <Button
                    style={{fontFamily: 'montserrat', paddingLeft: 10}}
                    onPress={() => navigation.goBack()}>
                    Back
                </Button>
            ),
            headerRight: (
                <Button
                    style={{fontFamily: 'montserrat', paddingRight: 10}}
                    onPress={async () => {
                        let response = await fetch('http://hackmit-degrees.herokuapp.com/update_profile', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                username: navigation.getParam('user'),
                                name:  navigation.getParam('name'),
                                email:  navigation.getParam('email'),
                                color:  navigation.getParam('color'),
                                major:  navigation.getParam('major'),
                                description:  navigation.getParam('description')
                            }),
                        });
                        let responseJson = await response.json();
                        if (responseJson.success == true) {
                            if (navigation.getParam('newUser', false)) {
                                navigation.navigate('Home');
                            } else {
                                navigation.navigate('Profile', {isLoading: 'true'});
                            }
                        } else {
                            Alert.alert(responseJson.reason);
                        }
                    }}>
                    Save
                </Button>
            ),
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {user: navigation.getParam('user', 'None')};
    }

    async componentDidMount() {
        let response = await fetch('http://hackmit-degrees.herokuapp.com/get_profile?'
            + 'username=' + this.state.user
        );
        let responseJson = await response.json();
        this.setState(responseJson);
        this.setState({isLoading: false});
    }

    render() {
        if (this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }
        return (
            <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
            >
                <View style={{flex: 2, justifyContent: 'space-around'}}>
                    <TextInput style={[styles.input, {fontSize: 30, color: '#33ccff'}]} defaultValue={this.state.name}
                               placeholder="Enter your name"
                               onChangeText={(name) => {this.setState({name}); this.props.navigation.setParams({name});}}/>
                    <Text style={[styles.input]}>username: {this.state.user}</Text>
                    <View style={{justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[styles.input]}>email:  </Text>
                        <TextInput style={[styles.input, {color: '#33ccff'}]} defaultValue={this.state.email}
                                   placeholder="Enter your email"
                                   onChangeText={(email) => {this.setState({email}); this.props.navigation.setParams({email});}}/>
                    </View>
                </View>
                <View style={{flex: 3.5, justifyContent: 'center'}}>
                    <Image
                        style={{width: 200, height: 200, borderRadius: 200/2, borderWidth: 2}}
                        source={{uri: this.state.image}}
                    />
                </View>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                        <Text style={[styles.input]}>Color:   </Text>
                        <TouchableOpacity
                            style={{width: 30, height: 30, borderWidth: 1, borderRadius: 50/2, backgroundColor: this.state.color}}
                            onPress={ () => {
                                var letters = '0123456789ABCDEF';
                                var color = '#';
                                for (var i = 0; i < 6; i++) {
                                    color += letters[Math.floor(Math.random() * 16)];
                                }
                                this.state.color = color;
                                this.props.navigation.setParams({color: color});
                            }}
                        />
                    </View>
                    <Text style={[styles.input, {color: '#33ccff'}]}>  (Touch circle to change color.)</Text>
                </View>
                <StatusBar barStyle="default" />
            </KeyboardAwareScrollView>
        );
    }

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    input: {
        fontSize: 18,
        fontFamily: 'montserrat',
        textAlign: 'center'
    },
    inputContainer: {
        borderWidth: 1 / PixelRatio.get(),
        borderColor: 'red',
        borderRadius: 6,
        height: 45,
        width: 250,
        margin: 2
    }
});