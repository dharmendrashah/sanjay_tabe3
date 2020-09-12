import React, { Component, } from "react";
import { StyleSheet, ScrollView, View, TextInput, ImageBackground, Text, Image, TouchableOpacity } from 'react-native';
import { Icon, Button, ThemeConsumer } from 'react-native-elements';
import { responsiveHeight, } from "react-native-responsive-dimensions";
import {FIREBASE, SERVICE, USER, LINK} from '../config';
var _ = require('lodash');
import theme from '@theme';
import { getToken, linkImage,specialLog, fetchScheduleMeeting, authUser, deleteScheduleMeeting, checkUser, getUserData, getMeetings, todayMeetings, nextDayMeetings } from '@action';
import { RFValue } from "react-native-responsive-fontsize";
export default class SelectParticipitant extends Component{
    constructor(props) {
        super(props);
        this.state = {
            value:  "",
            result: 0,
            resultObject: [],
        }

        this.participitant();
      }


      participitant = async () => {
        const a = await getUserData();
        this.setState({
          resultObject: a.data
        })
        console.log(a.data);
      }

      getdata = async(d) => {
        const a = await database()
        .ref(`/users`)
        .on('value', snapshot => {
          console.log('User data: ', snapshot.val());
        });
        return a;
      }


      UpdateSelected = (k) => {
        const {resultObject} = this.state;
        var d = [...resultObject];
        // checkThePrevious
        var p = d[k].selected; 
        if(p){
          d[k].selected = false;
        }else{
          d[k].selected = true;
        }
        this.setState({
          resultObject: d
        });
      }


      selectedObject = () => {
        const {resultObject} = this.state;
        let selected = [];
        resultObject.map(e => {
          if(e.selected){
            selected.push(e);
          }
        })
        return selected;
      }

      changeValue = async (text) => {
        const {resultObject} = this.state;
        this.setState({
            value: text
        });

        if(text.length > 3){
          var l = LINK+'api/search-user';
          var d = new FormData();
          var token = await getToken();
          d.append('token_code', token);
          d.append('search_key', text);
          var s = await fetch(l, {method:'POST', body:d});
          var v = s.status == 200 ? await s.json() : [];
          var j = v.status != 0 ? v.data : [];
          specialLog(j);
          this.setState({
            resultObject: j
          });
        }else{
          const a = await getUserData();
        this.setState({
          resultObject: []
        });
        }
      }

      DefaultScroll = () => {
        const {resultObject} = this.state;
        console.log("resuly", resultObject);
        if(resultObject.length === 0){
            return (<Text style={{ fontSize: 30, color: 'white' }}>No Data Found</Text>);
        }else{
          return (
            <ScrollView>
            <View style={{ flex:1, flexDirection: 'column' }}>
             {
               resultObject.map((e, k) => {
                 let backColor = "#dedede";
                 if(e.selected){
                  backColor = theme.TITLE;
                 }
                return ( 
                  <>
                  <TouchableOpacity onPress={() => this.UpdateSelected(k)} style={[styles.items, {backgroundColor: `${backColor}`}]}>
                   <Text style={styles.itemList}>
                    {e.name}
                   </Text>
                 </TouchableOpacity>
                </>
               )
               })
             }
            </View>
            </ScrollView>
          );
        }
      }

      goback = () => {
        this.props.navigation.navigate('ScheduleMeeting',{selected: this.selectedObject()})
      }

    render(){
      const {resultObject} = this.state;
        return(
            <>
             <ImageBackground source={theme.BACKGROUND_IMAGE} style={styles.container}>
            <View style={styles.HeaderContainer}>
                <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={styles.headerIconStyle}>
                <Icon name="arrow-left" type='material-community' size={30} color="white" />
                </TouchableOpacity>
                <TextInput
                    style={styles.CustomTextInput}
                    onChangeText={text => this.changeValue(text)}
                    value={this.state.value}
                    placeholder = {"Seach Participitants"}
                    placeholderTextColor = "#fff"
                />
            </View>
            <View style={styles.contentContainer}>
              <ScrollView contentContainerStyle={styles.scrollView}>
                  <this.DefaultScroll/>
              </ScrollView>
            </View>
            <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => {
              return this.goback();
          }}
        >
          <Text style={{ color: 'white', top: 10 }}>PROCEED</Text>
        </TouchableOpacity>
          </ImageBackground>
            </>
        );
    }
}


const styles = StyleSheet.create({
    buttonStyle: {
    alignItems: "center",
    backgroundColor: theme.TITLE,
    width: '100%',
    textAlign: 'center',
    marginBottom: '5%',
    height: 50,
    color: 'white'
    },
    items:{
      backgroundColor: 'white',
      height: RFValue(60),
      width: RFValue(300),
      marginBottom: 2,
      borderRadius: 20
    },
    itemList: {
      marginStart: 20,
      marginTop: 10,
      fontSize: 20
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
      width: '100%',
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: 20
    },
    scrollView: {
      height: '100%',
      width: '100%',
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
        backgroundColor: theme.TITLE,
        alignItems: 'center',
        justifyContent: 'center'
      },
      headerIconStyle:{ 
        position: 'absolute', 
        left: 20, 
        top: 50 
      }
  })
