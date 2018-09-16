import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Button from 'react-native-button'

export class MapScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Map',
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
        this.state = {
            nodes: [],
            currCoor: {latitude: 0, longitude: 0, timestamp: 0},
            isLoading: true,
        }
    }
    async componentDidMount() {
        navigator.geolocation.watchPosition(async (pos) => {
            this.setState({currCoor: {latitude: pos.coords.latitude, longitude: pos.coords.longitude, timestamp: pos.timestamp}})
            let res = await fetch(`http://hackmit-degrees.herokuapp.com/get_intersections?username=${this.props.navigation.getParam('userToken', 'None')}`)
            let resJson = await res.json();
            this.setState({nodes: resJson, isLoading: false});
        })
    }
    render() {
        
        if (this.state.isLoading) {
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <MapView style={styles.map} region={{
                        latitude: 42.3601,
                        longitude: -71.0942,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
                    }}>
                    {this.state.nodes.map(ele => <Marker
                        key={`${ele.coords[0]}+${ele.coords[1]}+${ele.user}`}
                        coordinate={{latitude: ele.coords[0], longitude: ele.coords[1]}}
                        onPress={() => this.props.navigation.navigate('Profile', {user: "a", userToken: "a", isLoading: true})}
                        image={require('./assets/images/grey_question_mark.png')}
                    />)}
                    <Marker coordinate={{latitude: this.state.currCoor.latitude, longitude: this.state.currCoor.longitude}}/>
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    map: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
})