import React, { Component, } from "react";
import { StyleSheet, ScrollView, View, TextInput,PixelRatio, Dimensions, SafeAreaView, ImageBackground, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { responsiveHeight, } from "react-native-responsive-dimensions";
import YouTube, { YouTubeStandaloneIOS, YouTubeStandaloneAndroid } from 'react-native-youtube';
import {YOUTUBE} from '../../config';
import {LINK} from '../config';
import theme from '@theme';
const displayWidth = Dimensions.get('window').width;
const displayHeight = Dimensions.get('window').height;

export default class VideoDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            value:  "",
            result: 0,
            resultObject: {},
            isReady: false,
            status: null,
            quality: null,
            error: null,
            isPlaying: true,
            isLooping: true,
            duration: 0,
            currentTime: 0,
            fullscreen: false,
            playerWidth: Dimensions.get('window').width,
            VideoDetails: {},
            videoId: props.route.params.selectedNews,
        }

        var link = LINK+'api/videoby-id';
        console.log("link", link)
        var data = new FormData();
        data.append('video_id', this.state.videoId);
        fetch(link, {
          method: "POST",
          body: data
        }).then(s => {
          if(s.status == 200){
            return s.json();
          }else{
            Alert.alert("Response is not 200")
          }
        }).then(s => {
          this.setState({
            VideoDetails: s['data'][0]
          })
          console.log("details", s['data'][0]);
        }).catch(e => {
          console.log("error =>", e)
        })
         




      }



      // start
      

      changeValue = async (text) => {
        this.setState({
            value: text
        });

        

        if(text.length > 3){
         
          
        }
      }

      DefaultScroll = () => {
        if(this.state.result === 0){
            return (<Text style={{ fontSize: 30, color: 'white' }}>No Data Found</Text>);
        }else{
            return null;
        }
      }

      _youTubeRef = React.createRef();

      Article = () => {
        const {VideoDetails} = this.state;
        const YOUR_API_KEY = YOUTUBE;
        return (
            <View style={{ backgroundColor: 'white', width: displayWidth-20, flex: 1, borderWidth: 0.1, borderBottomStartRadius: 20, borderBottomEndRadius:20, shadowColor: 'black', shadowOpacity: 10, flexDirection: 'column' }}>
            <View style={{flex: 1}}>
            
    <YouTube
      ref={this._youTubeRef}
      apiKey = {YOUR_API_KEY}
      playlistId={VideoDetails.url}
      play={this.state.isPlaying}
      loop={this.state.isLooping}
      fullscreen={this.state.fullscreen}
      controls={1}
      style={[
        { borderRadius: 10, height: PixelRatio.roundToNearestPixel(this.state.playerWidth / (16 / 9)) },
        styles.player,
      ]}
      onError={e => {
        this.setState({ error: e.error });
      }}
      onReady={e => {
        this.setState({ isReady: true });
      }}
      onChangeState={e => {
        this.setState({ status: e.state });
      }}
      onChangeQuality={e => {
        this.setState({ quality: e.quality });
      }}
      onChangeFullscreen={e => {
        this.setState({ fullscreen: e.isFullscreen });
      }}
      onProgress={e => {
        this.setState({ currentTime: e.currentTime });
      }}
    />
        </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ 
                    fontSize: 20,
                    marginStart: 10,
                    width: '100%'
                 }}>{VideoDetails.title}
                 {'\n'}
                <Text style={{ color: '#bfbbbb' }}>
                 {VideoDetails.details}
                 </Text>
                 </Text>
                 <Text style={{ marginTop: 2,borderRadius: 5, color: 'white', position: 'absolute', zIndex: 99999, backgroundColor: 'grey', marginStart: 270, width: -15 }}>
                 30 Jul
                 </Text>
            </View>
            </View>
        );
      }

    render(){
      
        return(
            <>

            <ImageBackground imageStyle={{}} source={require('@assets/bg-screen.png')} style={styles.container}>
            <View style={styles.HeaderContainer}>
                <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={styles.headerIconStyle}>
                <Icon name="arrow-left" type='material-community' size={30} color="white" />
                </TouchableOpacity>
            </View>
              <ScrollView contentContainerStyle={styles.scrollView}>
                  <this.Article/>
              
            <TouchableOpacity style={styles.buttonStyle} onPress={() => this.props.navigation.navigate('Videos',{refresh: true})}>
          <Text style={{ color: theme.FONT, top: 10, fontSize: 20, marginStart: -170 }}>| You may also like</Text>
        </TouchableOpacity>
        </ScrollView>
          
          </ImageBackground>
            </>
        );
    }
}


const styles = StyleSheet.create({
    buttonStyle: {
    alignItems: "center",
    backgroundColor: "transparent",
    width: '100%',
    textAlign: 'center',
    marginBottom: '5%',
    height: 50,
    color: 'white'
    },
    CustomTextInput: {
        borderBottomWidth: 3,
        borderBottomColor: 'white',
        width: '80%',
        end: 5,
        top:5,
        start: 30,
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    image: {
      height: '100%',
      width: '100%',
    },
    searchSection: {
      height: 40,
      width: '93%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderColor: '#595959',
      borderRadius: 30
    },
    searchIcon: {
      padding: 10,
    },
    button: {
      width: 100,
      height: 40,
      backgroundColor: 'transparent',
      borderRadius: 5,
    },
    input: {
      width: '100%',
      margin: 0,
      padding: 0,
      marginTop: '0%',
      textAlign: 'left',
      fontSize: 20,
      backgroundColor: '#fff',
      color: '#959595',
      height: '8%',
      fontSize: 20
    },
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    contentContainer: {
      height: '85%',
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: displayWidth
      

    },
    scrollView: {
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    imageContainer: {
      height: 150,
      width: 200,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center'
    },
    headingText: {
      color: 'white',
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    datePicker: {
      height: 40,
      width: '90%',
      borderColor: 'white',
      borderWidth: 0
    },
    dateIcon: {
      position: 'absolute',
      left: 0,
      top: 4,
      marginLeft: 0
    },

    HeaderContainer: {
        top: responsiveHeight(2),
        height: '15%',
        width: '100%',
        zIndex: 100,
        backgroundColor: theme.HEADER_BACKGROUND,
        alignItems: 'center',
        justifyContent: 'center'
      },
      headerIconStyle:{ 
        position: 'absolute', 
        left: 20, 
        top: 50 
      }
  })
