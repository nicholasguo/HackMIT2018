import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import MapView from 'react-native-maps';

export class MapScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <MapView style={styles.map} region={{
                        latitude: 59.329,
                        longitude: 18.068,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
                    }}>
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