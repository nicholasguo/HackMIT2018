import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    Platform,
    Image
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
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
            user: this.props.navigation.getParam('userToken', 'None'),
            isLoading: true,
        }
    }
    async componentDidMount() {
        navigator.geolocation.watchPosition(async (pos) => {
            this.setState({currCoor: {latitude: pos.coords.latitude, longitude: pos.coords.longitude, timestamp: pos.timestamp}})
            let res = await fetch(`http://hackmit-degrees.herokuapp.com/get_intersections?username=${this.state.user}`)
            let resJson = await res.json();
            let profileres = await fetch('http://hackmit-degrees.herokuapp.com/get_profile?'
                + 'username=' + this.state.user
            );
            let profileJson = await profileres.json();

            this.setState({nodes: resJson, isLoading: false});
            this.setState(profileJson);
        })
    }
    render() {
        console.log(this.state)
        if (this.state.isLoading) {
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <MapView provider={Platform.OS === 'ios' ? PROVIDER_GOOGLE:""} customMapStyle={mapStyle} style={styles.map} region={{
                        latitude: 42.3601,
                        longitude: -71.0942,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
                    }}>
                    {this.state.nodes.map(ele =>
                        <Marker
                            flat={true}
                            key={`${ele.coords[0]}+${ele.coords[1]}+${ele.user}`}
                            coordinate={{latitude: ele.coords[0], longitude: ele.coords[1]}}
                            onPress={() => this.props.navigation.navigate('Profile', {user: ele.user, userToken: ele.user, isLoading: true})}
                        >
                            <Image source={require('./assets/images/grey_question_mark.png')} style={{height: 30, width: 30}}/>
                        </Marker>)}
                    <Marker
                        flat={true}
                        coordinate={{latitude: this.state.currCoor.latitude, longitude: this.state.currCoor.longitude}}
                        pinColor={`${this.state.color}`}
                        onPress={() => this.props.navigation.navigate('Profile', {user: this.state.user, userToken: this.state.userToken, isLoading: true})}
                    >
                        <View style={{backgroundColor: "#ffffff", width: 24, height: 24, borderRadius: 12, borderWidth: 1}}/>
                    </Marker>
                </MapView>
            </View>
        );
    }
};
const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ];
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
    }
})