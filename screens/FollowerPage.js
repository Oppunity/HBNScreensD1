import React , {Component} from 'react';
import {View,Text, StyleSheet,  FlatList,Fragment,Dimensions,Image,TouchableOpacity} from 'react-native';  
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-circular-action-menu';
import Amplify, { Storage, Auth, API, graphqlOperation } from 'aws-amplify';
import { listOrgEvents, listOrgPics, listOrgInfos } from '../graphql/queries'
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import PTRView from 'react-native-pull-to-refresh'
import { StackActions, NavigationActions, NavigationEvents,withNavigation } from 'react-navigation';
var {width, height} = Dimensions.get('window')

class Follower extends Component {
      
      constructor(props) {
        super(props);
        this.state = {
            following: false, 
            buttonMessage:'Follow',
            sUser:[],
            IDENTITYID:'',
            CurrentIDENTITYID:'',
            orgoruser:'',
            cUser:'',
            cUsername:'',
            cUserpic:'',
            backgroundColor: 'dodgerblue',
            borderColor: 'dodgerblue',
            currentUser:[],
            orgimage:[],
            rand:''
            
         };
    }


    async componentDidMount() {
        var credentials = await Auth.currentCredentials()
        var identityIds = credentials.identityId
        this.state.CurrentIDENTITYID = identityIds 
        var credentials = await Auth.currentCredentials()
                      var identityIds = credentials._identityId
                      this.state.CurrentIDENTITYID = identityIds 
                      this.setState({sUser:this.props.navigation.getParam('sUser'),}, async function(){
                         //console.log('sUser.... '+this.props.navigation.getParam('sUser').identityId)
                         this.setState({IDENTITYID:this.state.sUser.identityId}, async function(){
                              console.log('FollowerUser.... '+this.state.sUser.orgName)
                              console.log('FollowerUser.... '+this.state.sUser.userName)
                              var orgquery = await API.graphql(graphqlOperation(queries.listOrgInfos, { filter: { identityId: { eq: this.state.CurrentIDENTITYID } } } ))
                              if(orgquery.data.listOrgInfos.items.length>0){
                                  this.setState({orgoruser:'org',cUser:orgquery.data.listOrgInfos.items[0],cUsername:orgquery.data.listOrgInfos.items[0].orgName,cUserpic:orgquery.data.listOrgInfos.items[0].OrgPicture})
                                  console.log('signed in as org')
                              } else {
                                  var userquery = await API.graphql(graphqlOperation(queries.listUserInfos, { filter: { identityId: { eq: this.state.CurrentIDENTITYID } } } ))
                                  //console.log(AllUserData.data.listUserInfos.items[0])
                                  if(userquery.data.listUserInfos.items.length>0){
                                  this.setState({orgoruser:'user',cUser:userquery.data.listUserInfos.items[0],cUsername:userquery.data.listUserInfos.items[0].userName,cUserpic:userquery.data.listUserInfos.items[0].UserPicture})
                                  console.log('signed in as user')
                                  } else {
                                  alert('Error')
                                  }
                              }
                              var followers = await API.graphql(graphqlOperation(queries.listFollowers, { filter: { Followingid: {eq:this.state.IDENTITYID}  }} ))
                              console.log('FOLLOWERS')
                              console.log(followers)
                              //console.log('AllUserData:', AllUserData)
                              //console.log(this.state.search)
                              await this.setState({
                              currentUser: followers.data.listFollowers.items,
                              srnames:[],srids:[],orgimage:[],orgpicname:''
                              }, async function (){
                                for(let i=0;(i<this.state.currentUser.length & (i<8)); i++){
                                    this.setState({srnames: [...this.state.srnames, this.state.currentUser[i].userName], srids:[...this.state.srids, this.state.currentUser[i].Followingid]})
                                    try{
                                        var UserPic = await API.graphql(graphqlOperation(queries.listUserPics, { filter: { identityId: { eq: this.state.srids[i] }}}))

                                    } catch {
                                        var OrgPic = await API.graphql(graphqlOperation(queries.listOrgPics, { filter: { identityId: { eq: this.state.srids[i] }}}))
                                    }
                                                                        
                                    if(UserPic.data.listUserPics.items.length>0){
                                        this.setState({
                                            SearchUserPic:  UserPic.data.listUserPics.items, 
                                            })
                                        
                                        console.log('this.state.SearchUserPic: ', this.state.SearchUserPic)
                                        console.log('sridsStorage:', this.state.srids[i])
                                        console.log('this.state.SearchUserPic.OrgPicture: ', this.state.SearchUserPic.slice(0)[0].UserPicture)
                                        this.state.orgpicname = this.state.SearchUserPic.slice(0)[0].UserPicture
                                        console.log(' this.state.orgpicname: ', this.state.orgpicname)
                                        await Storage.get(this.state.orgpicname, {level: 'protected', identityId: this.state.srids[i]})
                                            .then(data => {
                                            this.setState({
                                                orgimage: [...this.state.orgimage, data],
                                            })
                                            if (this.state.orgimage.length > this.state.currentUser.length) {
                                                //this.state.orgimage.pop()
                                            }
                                            //console.log('gotImage!', this.state.orgimage)
                                            })
                                            if ( this.state.currentUser.length == []) {
                                                this.state.orgimage = []
                                            }
                                    } else if (OrgPic.data.listOrgPics.items.length>0) {
                                        this.setState({SearchUserPic:  OrgPic.data.listOrgPics.items})
                                        this.state.orgpicname = this.state.SearchUserPic.slice(0)[0].OrgPicture
                                        //console.log(' this.state.orgpicname: ', this.state.orgpicname)
                                        await Storage.get(this.state.orgpicname, {level: 'protected', identityId: this.state.srids[i]})
                                            .then(data => {
                                            this.setState({
                                                orgimage: [...this.state.orgimage, data],
                                            })
                                            if (this.state.orgimage.length > this.state.currentUser.length) {
                                                //this.state.orgimage.pop()
                                            }
                                            //console.log('gotImage!', this.state.orgimage)
                                            })
                                            if ( this.state.currentUser.length == []) {
                                                this.state.orgimage = []
                                            }
                                    }
                                }
                              })
                              
                         })})
        /*this.setState({sUser:this.props.navigation.getParam('sUser'),}, async function(){
           //console.log('sUser.... '+this.props.navigation.getParam('sUser').identityId)
           this.setState({IDENTITYID:this.state.sUser.identityId}, async function(){
                console.log('FollowerUser.... '+this.state.sUser.orgName)
                console.log('FollowerUser.... '+this.state.sUser.userName)
                var orgquery = await API.graphql(graphqlOperation(queries.listOrgInfos, { filter: { identityId: { eq: this.state.CurrentIDENTITYID } } } ))
                if(orgquery.data.listOrgInfos.items.length>0){
                    this.setState({orgoruser:'org',cUser:orgquery.data.listOrgInfos.items[0],cUsername:orgquery.data.listOrgInfos.items[0].orgName,cUserpic:orgquery.data.listOrgInfos.items[0].OrgPicture})
                    console.log('signed in as org')
                } else {
                    var userquery = await API.graphql(graphqlOperation(queries.listUserInfos, { filter: { identityId: { eq: this.state.CurrentIDENTITYID } } } ))
                    //console.log(AllUserData.data.listUserInfos.items[0])
                    if(userquery.data.listUserInfos.items.length>0){
                    this.setState({orgoruser:'user',cUser:userquery.data.listUserInfos.items[0],cUsername:userquery.data.listUserInfos.items[0].userName,cUserpic:userquery.data.listUserInfos.items[0].UserPicture})
                    console.log('signed in as user')
                    } else {
                    alert('Error')
                    }
                }
                var followers = await API.graphql(graphqlOperation(queries.listFollowers, { filter: { Followingid: {eq:this.state.IDENTITYID}  }} ))

                //console.log('AllUserData:', AllUserData)
                //console.log(this.state.search)
                await this.setState({
                currentUser: followers.data.listFollowers.items,
                srnames:[],srids:[],orgimage:[],orgpicname:''
                })
                for(let i=0;(i<this.state.currentUser.length & (i<8)); i++){
                    this.setState({srnames: [...this.state.srnames, this.state.currentUser[i].userName], srids:[...this.state.srids, this.state.currentUser[i].Followingid]})
                    var UserPic = await API.graphql(graphqlOperation(queries.listUserPics, { filter: { identityId: { eq: this.state.srids[i] }}}))
                    var OrgPic = await API.graphql(graphqlOperation(queries.listOrgPics, { filter: { identityId: { eq: this.state.srids[i] }}}))
                    if(UserPic.data.listUserPics.items.length>0){
                        this.setState({
                            SearchUserPic:  UserPic.data.listUserPics.items, 
                            })
                        
                        console.log('this.state.SearchUserPic: ', this.state.SearchUserPic)
                        console.log('sridsStorage:', this.state.srids[i])
                        console.log('this.state.SearchUserPic.OrgPicture: ', this.state.SearchUserPic.slice(0)[0].UserPicture)
                        this.state.orgpicname = this.state.SearchUserPic.slice(0)[0].UserPicture
                        console.log(' this.state.orgpicname: ', this.state.orgpicname)
                        await Storage.get(this.state.orgpicname, {level: 'protected', identityId: this.state.srids[i]})
                            .then(data => {
                            this.setState({
                                orgimage: [...this.state.orgimage, data],
                            })
                            if (this.state.orgimage.length > this.state.currentUser.length) {
                                this.state.orgimage.pop()
                            }
                            //console.log('gotImage!', this.state.orgimage)
                            })
                            if ( this.state.currentUser.length == []) {
                                this.state.orgimage = []
                            }
                    } else if (OrgPic.data.listOrgPics.items.length>0) {
                        this.setState({SearchUserPic:  OrgPic.data.listOrgPics.items})
                        this.state.orgpicname = this.state.SearchUserPic.slice(0)[0].OrgPicture
                        //console.log(' this.state.orgpicname: ', this.state.orgpicname)
                        await Storage.get(this.state.orgpicname, {level: 'protected', identityId: this.state.srids[i]})
                            .then(data => {
                            this.setState({
                                orgimage: [...this.state.orgimage, data],
                            })
                            if (this.state.orgimage.length > this.state.currentUser.length) {
                                this.state.orgimage.pop()
                            }
                            //console.log('gotImage!', this.state.orgimage)
                            })
                            if ( this.state.currentUser.length == []) {
                                this.state.orgimage = []
                            }
                    }
                }
           })})
        /*this.willFocusSubscription = this.props.navigation.addListener('willFocus', async(payload) => {
            //console.log('[print action for test:]', payload);
            if (['Navigation/INIT', 'Navigation/NAVIGATE', 'Navigation/POP_TO_TOP'].includes(payload.action.type)) {
                var credentials = await Auth.currentCredentials()
                var identityIds = credentials._identityId
                this.state.CurrentIDENTITYID = identityIds 
                this.setState({sUser:this.props.navigation.getParam('sUser'),}, async function(){
                   //console.log('sUser.... '+this.props.navigation.getParam('sUser').identityId)
                   this.setState({IDENTITYID:this.state.sUser.identityId}, async function(){
                        console.log('FollowerUser.... '+this.state.sUser.orgName)
                        console.log('FollowerUser.... '+this.state.sUser.userName)
                        var orgquery = await API.graphql(graphqlOperation(queries.listOrgInfos, { filter: { identityId: { eq: this.state.CurrentIDENTITYID } } } ))
                        if(orgquery.data.listOrgInfos.items.length>0){
                            this.setState({orgoruser:'org',cUser:orgquery.data.listOrgInfos.items[0],cUsername:orgquery.data.listOrgInfos.items[0].orgName,cUserpic:orgquery.data.listOrgInfos.items[0].OrgPicture})
                            console.log('signed in as org')
                        } else {
                            var userquery = await API.graphql(graphqlOperation(queries.listUserInfos, { filter: { identityId: { eq: this.state.CurrentIDENTITYID } } } ))
                            //console.log(AllUserData.data.listUserInfos.items[0])
                            if(userquery.data.listUserInfos.items.length>0){
                            this.setState({orgoruser:'user',cUser:userquery.data.listUserInfos.items[0],cUsername:userquery.data.listUserInfos.items[0].userName,cUserpic:userquery.data.listUserInfos.items[0].UserPicture})
                            console.log('signed in as user')
                            } else {
                            alert('Error')
                            }
                        }
                        var followers = await API.graphql(graphqlOperation(queries.listFollowers, { filter: { Followingid: {eq:this.state.IDENTITYID}  }} ))

                        //console.log('AllUserData:', AllUserData)
                        //console.log(this.state.search)
                        await this.setState({
                        currentUser: followers.data.listFollowers.items,
                        srnames:[],srids:[],orgimage:[],orgpicname:''
                        })
                        for(let i=0;(i<this.state.currentUser.length & (i<8)); i++){
                            this.setState({srnames: [...this.state.srnames, this.state.currentUser[i].userName], srids:[...this.state.srids, this.state.currentUser[i].Followingid]})
                            var UserPic = await API.graphql(graphqlOperation(queries.listUserPics, { filter: { identityId: { eq: this.state.srids[i] }}}))
                            var OrgPic = await API.graphql(graphqlOperation(queries.listOrgPics, { filter: { identityId: { eq: this.state.srids[i] }}}))
                            if(UserPic.data.listUserPics.items.length>0){
                                this.setState({
                                    SearchUserPic:  UserPic.data.listUserPics.items, 
                                    })
                                
                                console.log('this.state.SearchUserPic: ', this.state.SearchUserPic)
                                console.log('sridsStorage:', this.state.srids[i])
                                console.log('this.state.SearchUserPic.OrgPicture: ', this.state.SearchUserPic.slice(0)[0].UserPicture)
                                this.state.orgpicname = this.state.SearchUserPic.slice(0)[0].UserPicture
                                console.log(' this.state.orgpicname: ', this.state.orgpicname)
                                await Storage.get(this.state.orgpicname, {level: 'protected', identityId: this.state.srids[i]})
                                    .then(data => {
                                    this.setState({
                                        orgimage: [...this.state.orgimage, data],
                                    })
                                    if (this.state.orgimage.length > this.state.currentUser.length) {
                                        this.state.orgimage.pop()
                                    }
                                    //console.log('gotImage!', this.state.orgimage)
                                    })
                                    if ( this.state.currentUser.length == []) {
                                        this.state.orgimage = []
                                    }
                            } else if (OrgPic.data.listOrgPics.items.length>0) {
                                this.setState({SearchUserPic:  OrgPic.data.listOrgPics.items})
                                this.state.orgpicname = this.state.SearchUserPic.slice(0)[0].OrgPicture
                                //console.log(' this.state.orgpicname: ', this.state.orgpicname)
                                await Storage.get(this.state.orgpicname, {level: 'protected', identityId: this.state.srids[i]})
                                    .then(data => {
                                    this.setState({
                                        orgimage: [...this.state.orgimage, data],
                                    })
                                    if (this.state.orgimage.length > this.state.currentUser.length) {
                                        this.state.orgimage.pop()
                                    }
                                    //console.log('gotImage!', this.state.orgimage)
                                    })
                                    if ( this.state.currentUser.length == []) {
                                        this.state.orgimage = []
                                    }
                            }
                        }
                   })
                   
                   //this.state.IDENTITYID =this.state.sUser.identityId
        
               // determine if person logged in is org or user
               })
            }
        })*/





        var credentials = await Auth.currentCredentials()
        var identityIds = credentials._identityId
        this.state.CurrentIDENTITYID = identityIds 
        /*this.setState({sUser:this.props.navigation.getParam('sUser'),IDENTITYID:this.state.sUser.identityId}, async function(){
            this.setState({IDENTITYID:this.state.sUser.identityId}, async function(){
                console.log('FollowerUser.... '+this.state.sUser.orgName)
                console.log('FollowerUser.... '+this.state.sUser.userName)
                var orgquery = await API.graphql(graphqlOperation(queries.listOrgInfos, { filter: { identityId: { eq: this.state.CurrentIDENTITYID } } } ))
                if(orgquery.data.listOrgInfos.items.length>0){
                    this.setState({orgoruser:'org',cUser:orgquery.data.listOrgInfos.items[0],cUsername:orgquery.data.listOrgInfos.items[0].orgName,cUserpic:orgquery.data.listOrgInfos.items[0].OrgPicture})
                    console.log('signed in as org')
                } else {
                    var userquery = await API.graphql(graphqlOperation(queries.listUserInfos, { filter: { identityId: { eq: this.state.CurrentIDENTITYID } } } ))
                    //console.log(AllUserData.data.listUserInfos.items[0])
                    if(userquery.data.listUserInfos.items.length>0){
                    this.setState({orgoruser:'user',cUser:userquery.data.listUserInfos.items[0],cUsername:userquery.data.listUserInfos.items[0].userName,cUserpic:userquery.data.listUserInfos.items[0].UserPicture})
                    console.log('signed in as user')
                    } else {
                    alert('Error')
                    }
                }
                var followers = await API.graphql(graphqlOperation(queries.listFollowers, { filter: { Followingid: {eq:this.state.IDENTITYID}  }} ))

                //console.log('AllUserData:', AllUserData)
                //console.log(this.state.search)
                await this.setState({
                currentUser: followers.data.listFollowers.items,
                srnames:[],srids:[],orgimage:[],orgpicname:''
                })
                for(let i=0;(i<this.state.currentUser.length & (i<8)); i++){
                    this.setState({srnames: [...this.state.srnames, this.state.currentUser[i].userName], srids:[...this.state.srids, this.state.currentUser[i].Followingid]})
                    var UserPic = await API.graphql(graphqlOperation(queries.listUserPics, { filter: { identityId: { eq: this.state.srids[i] }}}))
                    var OrgPic = await API.graphql(graphqlOperation(queries.listOrgPics, { filter: { identityId: { eq: this.state.srids[i] }}}))
                    if(UserPic.data.listUserPics.items.length>0){
                        this.setState({
                            SearchUserPic:  UserPic.data.listUserPics.items, 
                            })
                        
                        console.log('this.state.SearchUserPic: ', this.state.SearchUserPic)
                        console.log('sridsStorage:', this.state.srids[i])
                        console.log('this.state.SearchUserPic.OrgPicture: ', this.state.SearchUserPic.slice(0)[0].UserPicture)
                        this.state.orgpicname = this.state.SearchUserPic.slice(0)[0].UserPicture
                        console.log(' this.state.orgpicname: ', this.state.orgpicname)
                        await Storage.get(this.state.orgpicname, {level: 'protected', identityId: this.state.srids[i]})
                            .then(data => {
                            this.setState({
                                orgimage: [...this.state.orgimage, data],
                            })
                            if (this.state.orgimage.length > this.state.currentUser.length) {
                                this.state.orgimage.pop()
                            }
                            //console.log('gotImage!', this.state.orgimage)
                            })
                            if ( this.state.currentUser.length == []) {
                                this.state.orgimage = []
                            }
                    } else if (OrgPic.data.listOrgPics.items.length>0) {
                        this.setState({SearchUserPic:  OrgPic.data.listOrgPics.items})
                        this.state.orgpicname = this.state.SearchUserPic.slice(0)[0].OrgPicture
                        //console.log(' this.state.orgpicname: ', this.state.orgpicname)
                        await Storage.get(this.state.orgpicname, {level: 'protected', identityId: this.state.srids[i]})
                            .then(data => {
                            this.setState({
                                orgimage: [...this.state.orgimage, data],
                            })
                            if (this.state.orgimage.length > this.state.currentUser.length) {
                                this.state.orgimage.pop()
                            }
                            //console.log('gotImage!', this.state.orgimage)
                            })
                            if ( this.state.currentUser.length == []) {
                                this.state.orgimage = []
                            }
                    }
                }
           })
           
           //for(let i=0; i<this.state.orgpicname.length; i++) {
           //await Storage.get(this.state.orgpicname[i], {level: 'protected'})
           //.then(data => {
           // console.log("data: ", data)
           //this.setState({
           //image: [...this.state.image, data]
           //})
           // console.log('image: ', this.state.image)
           //})
           //.catch(err => {
           //console.log("error fetching image", err)
           //})
           //}
        })*/
       }








updateFollow = async() => {

            if(this.state.followings) { 
            var cUserfollows = await API.graphql(graphqlOperation(queries.listFollowers, { filter: { Followingid: { eq: this.state.IDENTITYID },Followerid:{eq:this.state.CurrentIDENTITYID} } } ))
            var cUserfollowing = await API.graphql(graphqlOperation(queries.listFollowings, { filter: { Followerid: { eq: this.state.CurrentIDENTITYID},Followingid:{eq:this.state.IDENTITYID} } } ))
            this.setState({followings:true,backgroundColor: 'black', borderColor: 'grey',buttonMessage: 'Following',followerrowid:cUserfollows.data.listFollowers.items[0].id,followingrowid:cUserfollowing.data.listFollowings.items[0].id})
            await API.graphql(graphqlOperation(mutations.deleteFollowing, {input: {id:this.state.followingrowid} }))
            await API.graphql(graphqlOperation(mutations.deleteFollower, {input: {id:this.state.followerrowid} }))
        
            this.setState((prevState, props) => {
                return {
                backgroundColor: 'dodgerblue',
                borderColor: 'dodgerblue',
                
                followings: false,
                buttonMessage: 'Follow',
                    
                        
                };
            });
        
        } else {
            await API.graphql(graphqlOperation(mutations.createFollowing, {input: {Followerid:this.state.CurrentIDENTITYID, Followingid:this.state.orginfo.identityId,Followingname:this.state.orginfo.orgName,Followingppic:this.state.orginfo.OrgPicture} }))
            await API.graphql(graphqlOperation(mutations.createFollower, {input: {Followingid:this.state.orginfo.identityId, Followerid:this.state.CurrentIDENTITYID,Followername:this.state.cUsername,Followerppic:this.state.cUserpic} }))
            this.setState((prevState,props) => {
                return { 
                    
                backgroundColor: 'black',
                borderColor: 'gray',
                
                followings: true,
                buttonMessage: 'Following',
                        
            };
        });
        
        } 
     }
     /*componentWillUnmount() {
         {
          this.props.navigation.state.params.onGoBack(this.state.orginfo);
        } 
      }*/
     onGoBack = async(someDataFromModal) => {
        this.setState({sUser:someDataFromModal},async function(){
            var credentials = await Auth.currentCredentials()
            var identityIds = credentials._identityId
            this.state.CurrentIDENTITYID = identityIds 
            //this.setState({sUser:this.props.navigation.getParam('sUser'),}, async function(){
               //console.log('sUser.... '+this.props.navigation.getParam('sUser').identityId)
               this.setState({IDENTITYID:this.state.sUser.identityId}, async function(){
                    console.log('FollowerUser.... '+this.state.sUser.orgName)
                    console.log('FollowerUser.... '+this.state.sUser.userName)
                    var orgquery = await API.graphql(graphqlOperation(queries.listOrgInfos, { filter: { identityId: { eq: this.state.CurrentIDENTITYID } } } ))
                    if(orgquery.data.listOrgInfos.items.length>0){
                        this.setState({orgoruser:'org',cUser:orgquery.data.listOrgInfos.items[0],cUsername:orgquery.data.listOrgInfos.items[0].orgName,cUserpic:orgquery.data.listOrgInfos.items[0].OrgPicture})
                        console.log('signed in as org')
                    } else {
                        var userquery = await API.graphql(graphqlOperation(queries.listUserInfos, { filter: { identityId: { eq: this.state.CurrentIDENTITYID } } } ))
                        //console.log(AllUserData.data.listUserInfos.items[0])
                        if(userquery.data.listUserInfos.items.length>0){
                        this.setState({orgoruser:'user',cUser:userquery.data.listUserInfos.items[0],cUsername:userquery.data.listUserInfos.items[0].userName,cUserpic:userquery.data.listUserInfos.items[0].UserPicture})
                        console.log('signed in as user')
                        } else {
                        alert('Error')
                        }
                    }
                    var followers = await API.graphql(graphqlOperation(queries.listFollowers, { filter: { Followingid: {eq:this.state.IDENTITYID}  }} ))
                    console.log('FOLLOWERS')
                    console.log(followers)
                    //console.log('AllUserData:', AllUserData)
                    //console.log(this.state.search)
                    await this.setState({
                    currentUser: followers.data.listFollowers.items,
                    srnames:[],srids:[],orgimage:[],orgpicname:''
                    })
                    for(let i=0;(i<this.state.currentUser.length & (i<8)); i++){
                        this.setState({srnames: [...this.state.srnames, this.state.currentUser[i].userName], srids:[...this.state.srids, this.state.currentUser[i].Followingid]})
                        var UserPic = await API.graphql(graphqlOperation(queries.listUserPics, { filter: { identityId: { eq: this.state.srids[i] }}}))
                        var OrgPic = await API.graphql(graphqlOperation(queries.listOrgPics, { filter: { identityId: { eq: this.state.srids[i] }}}))
                        if(UserPic.data.listUserPics.items.length>0){
                            this.setState({
                                SearchUserPic:  UserPic.data.listUserPics.items, 
                                })
                            
                            console.log('this.state.SearchUserPic: ', this.state.SearchUserPic)
                            console.log('sridsStorage:', this.state.srids[i])
                            console.log('this.state.SearchUserPic.OrgPicture: ', this.state.SearchUserPic.slice(0)[0].UserPicture)
                            this.state.orgpicname = this.state.SearchUserPic.slice(0)[0].UserPicture
                            console.log(' this.state.orgpicname: ', this.state.orgpicname)
                            await Storage.get(this.state.orgpicname, {level: 'protected', identityId: this.state.srids[i]})
                                .then(data => {
                                this.setState({
                                    orgimage: [...this.state.orgimage, data],
                                })
                                if (this.state.orgimage.length > this.state.currentUser.length) {
                                    //this.state.orgimage.pop()
                                }
                                //console.log('gotImage!', this.state.orgimage)
                                })
                                if ( this.state.currentUser.length == []) {
                                    this.state.orgimage = []
                                }
                        } else if (OrgPic.data.listOrgPics.items.length>0) {
                            this.setState({SearchUserPic:  OrgPic.data.listOrgPics.items})
                            this.state.orgpicname = this.state.SearchUserPic.slice(0)[0].OrgPicture
                            //console.log(' this.state.orgpicname: ', this.state.orgpicname)
                            await Storage.get(this.state.orgpicname, {level: 'protected', identityId: this.state.srids[i]})
                                .then(data => {
                                this.setState({
                                    orgimage: [...this.state.orgimage, data],
                                })
                                if (this.state.orgimage.length > this.state.currentUser.length) {
                                    //this.state.orgimage.pop()
                                }
                                //console.log('gotImage!', this.state.orgimage)
                                })
                                if ( this.state.currentUser.length == []) {
                                    this.state.orgimage = []
                                }
                        }
                    }
               })
        }) 
        //console.log('username passed in: '+someDataFromModal);
        //console.log('username passed in: '+someDataFromModal.userName);
        //console.log('orgname passed in: '+someDataFromModal.orgName);
      }
    render (){
        //console.log('suser passed in '+this.state.sUser.userName)    
        //console.log('suser passed in '+this.state.sUser.userName)
        //console.log('suser passed in '+this.state.sUser.userName)
        //console.log('suser passed in '+this.state.sUser.userName)
        //console.log('suser passed in '+this.state.sUser.userName)
        //console.log('username passed in '+this.state.sUser.userName)
        //console.log('orgname passed in '+this.state.sUser.orgName)
        //console.log('identityid passed in '+this.state.sUser.identityId)
        //console.log('orgname is...'+this.props.navigation.state.params.sUser.orgName)
        //console.log('orgname is...'+this.state.sUser.orgName)
        //console.log('SUSER PASSED IN'+this.state.sUser.userName)
        console.log('id PASSED IN'+this.state.sUser.identityId)
        //console.log(Math.random)
    //console.log('ongoback is...'+this.props.navigation.state.params.onGoBack())
        return(     
            
            <View style = {{flex:1, width: 100 + "%", backgroundColor:'black'}}> 
                  <NavigationEvents onWillFocus={async()=>{
                      var credentials = await Auth.currentCredentials()
                      var identityIds = credentials._identityId
                      this.state.CurrentIDENTITYID = identityIds 
                      //this.setState({sUser:this.props.navigation.getParam('sUser'),}, async function(){
                         //console.log('sUser.... '+this.props.navigation.getParam('sUser').identityId)
                         this.setState({IDENTITYID:this.state.sUser.identityId}, async function(){
                              console.log('FollowerUser.... '+this.state.sUser.orgName)
                              console.log('FollowerUser.... '+this.state.sUser.userName)
                              var orgquery = await API.graphql(graphqlOperation(queries.listOrgInfos, { filter: { identityId: { eq: this.state.CurrentIDENTITYID } } } ))
                              if(orgquery.data.listOrgInfos.items.length>0){
                                  this.setState({orgoruser:'org',cUser:orgquery.data.listOrgInfos.items[0],cUsername:orgquery.data.listOrgInfos.items[0].orgName,cUserpic:orgquery.data.listOrgInfos.items[0].OrgPicture})
                                  console.log('signed in as org')
                              } else {
                                  var userquery = await API.graphql(graphqlOperation(queries.listUserInfos, { filter: { identityId: { eq: this.state.CurrentIDENTITYID } } } ))
                                  //console.log(AllUserData.data.listUserInfos.items[0])
                                  if(userquery.data.listUserInfos.items.length>0){
                                  this.setState({orgoruser:'user',cUser:userquery.data.listUserInfos.items[0],cUsername:userquery.data.listUserInfos.items[0].userName,cUserpic:userquery.data.listUserInfos.items[0].UserPicture})
                                  console.log('signed in as user')
                                  } else {
                                  alert('Error')
                                  }
                              }
                              var followers = await API.graphql(graphqlOperation(queries.listFollowers, { filter: { Followingid: {eq:this.state.IDENTITYID}  }} ))
                              console.log('FOLLOWERS')
                    console.log(followers)
                              //console.log('AllUserData:', AllUserData)
                              //console.log(this.state.search)
                              await this.setState({
                              currentUser: followers.data.listFollowers.items,
                              srnames:[],srids:[],orgimage:[],orgpicname:''
                              })
                              for(let i=0;(i<this.state.currentUser.length & (i<8)); i++){
                                  this.setState({srnames: [...this.state.srnames, this.state.currentUser[i].userName], srids:[...this.state.srids, this.state.currentUser[i].Followingid]})
                                  var UserPic = await API.graphql(graphqlOperation(queries.listUserPics, { filter: { identityId: { eq: this.state.srids[i] }}}))
                                  var OrgPic = await API.graphql(graphqlOperation(queries.listOrgPics, { filter: { identityId: { eq: this.state.srids[i] }}}))
                                  if(UserPic.data.listUserPics.items.length>0){
                                      this.setState({
                                          SearchUserPic:  UserPic.data.listUserPics.items, 
                                          })
                                      
                                      console.log('this.state.SearchUserPic: ', this.state.SearchUserPic)
                                      console.log('sridsStorage:', this.state.srids[i])
                                      console.log('this.state.SearchUserPic.OrgPicture: ', this.state.SearchUserPic.slice(0)[0].UserPicture)
                                      this.state.orgpicname = this.state.SearchUserPic.slice(0)[0].UserPicture
                                      console.log(' this.state.orgpicname: ', this.state.orgpicname)
                                      await Storage.get(this.state.orgpicname, {level: 'protected', identityId: this.state.srids[i]})
                                          .then(data => {
                                          this.setState({
                                              orgimage: [...this.state.orgimage, data],
                                          })
                                          if (this.state.orgimage.length > this.state.currentUser.length) {
                                              //this.state.orgimage.pop()
                                          }
                                          //console.log('gotImage!', this.state.orgimage)
                                          })
                                          if ( this.state.currentUser.length == []) {
                                              this.state.orgimage = []
                                          }
                                  } else if (OrgPic.data.listOrgPics.items.length>0) {
                                      this.setState({SearchUserPic:  OrgPic.data.listOrgPics.items})
                                      this.state.orgpicname = this.state.SearchUserPic.slice(0)[0].OrgPicture
                                      //console.log(' this.state.orgpicname: ', this.state.orgpicname)
                                      await Storage.get(this.state.orgpicname, {level: 'protected', identityId: this.state.srids[i]})
                                          .then(data => {
                                          this.setState({
                                              orgimage: [...this.state.orgimage, data],
                                          })
                                          if (this.state.orgimage.length > this.state.currentUser.length) {
                                              //this.state.orgimage.pop()
                                          }
                                          //console.log('gotImage!', this.state.orgimage)
                                          })
                                          if ( this.state.currentUser.length == []) {
                                              this.state.orgimage = []
                                          }
                                  }
                              }
                         })
                         
                         //this.state.IDENTITYID =this.state.sUser.identityId
              
                     // determine if person logged in is org or user
                     
                  }}/>
                  <PTRView onRefresh={function(){return new Promise((resolve)=>{setTimeout(()=>{resolve()},500)})}}>  
                <View style = {{width:'100%',height:'100%'}}> 
                    <FlatList 
                        style={{height: '100%',width:'100%',position:'absolute',top:'10%'}}
                        data={this.state.orgimage}
                        scrollEnabled={false}
                        //numColumns = {this.state.numColumnss}
                        //key={this.state.numColumnss}
                        renderItem={ ({ item }) => (
                            
                        <View style={[ {top:'0%'},{borderColor:'white'},{borderWidth:1},{width:'100%'}, {height: (width/6)}, 
                        
                        ]}
                        onPress={() => this.props.navigation.navigate('OrgProfile', {sUser:this.state.orgimage})} >

                        <Image style={{ borderRadius: 50/2, height: '80%', width: '20%', position:'absolute',top:'10%',left:'1%', paddingTop: '10%' }} source = {{uri: item }} />
                        {/*<Image source={{uri: item}} style={{flex: 1, width: undefined, height: undefined}} />*/}
                        </View>
                        )
                        } 
                        keyExtractor={(items, index, numColumns) => index.toString()} />

                    <FlatList 
                        style={{height: '100%',width:'100%',position:'absolute',top:'10%'}}
                        data={this.state.currentUser}
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        renderItem={ ({ item }) => (
                        <TouchableOpacity style={[ {top:'0%'}, {borderColor:'black'},{borderWidth:0},{width:'110%'}, {height: (width/6)}, 
                        
                        ]}
                        onPress={async() => {
                            var orgquery = await API.graphql(graphqlOperation(queries.listOrgInfos, { filter: { identityId: { eq: item.Followerid } } } ))
                            if(orgquery.data.listOrgInfos.items.length>0){
                                
                                this.props.navigation.navigate('OrgProfile', {sUser:orgquery.data.listOrgInfos.items[0],onGoBack:this.onGoBack.bind(this)})
                                //this.props.navigation.navigate('OrgProfile', {sUser:orgquery.data.listOrgInfos.items[0],onGoBack:this.onGoBack})
                            } else {
                                var userquery = await API.graphql(graphqlOperation(queries.listUserInfos, { filter: { identityId: { eq: item.Followerid } } } ))
                                if(userquery.data.listUserInfos.items.length>0){
                                    this.props.navigation.navigate('UserProfile', {sUser:userquery.data.listUserInfos.items[0],onGoBack:this.onGoBack.bind(this)})
                                    //this.props.navigation.navigate('UserProfile', {sUser:userquery.data.listUserInfos.items[0],onGoBack:this.onGoBack})
                                } else {
                                alert('Error')
                                }
                            }
                            }}>
                        <Text style={{color:'white',position:'absolute',top:'20%',left:'32%',fontSize:30,color:'#42a5f5'}}>{item.Followername}</Text>
                        </TouchableOpacity>
                        )
                        } 
                        keyExtractor={(items, index, numColumns) => index.toString()} />
        
                                           
                </View>

                </PTRView>
                

                <ActionButton
             buttonColor="rgba(231,76,60,1)" 
             radius = {120}
             style={styles.actionButton}
             bgColor = 'black'
             btnOutRange = 'black'
             >


          <ActionButton.Item buttonColor='dodgerblue' size = {50} 
            onPress={() => {if(this.state.orgoruser=='user'){this.props.navigation.navigate('UserProfile',{sUser:this.state.cUser})} else{
              //CollegeA:this.state.sUser.CollegeA,OrgSchool:this.state.sUser.OrgSchool,OrgText:this.state.sUser.OrgText,identityId:this.state.sUser.identityId,oratingp:this.state.sUser.oratingp,oratingt:this.state.sUser.oratingt,orgBioatingp:this.state.sUser.oratingp})} else
             this.props.navigation.navigate('OrgProfile',{sUser:this.state.cUser})}}}>
            <Icon name="ios-contact" style={styles.actionButtonIcon} size = {50} />
          </ActionButton.Item>

      
          <ActionButton.Item buttonColor='orangered' size = {50} onPress={() => this.props.navigation.navigate('MainFeed')}>
            <Icon name="ios-home" style={styles.actionButtonIcon} size = {50} />
          </ActionButton.Item>


          <ActionButton.Item buttonColor='magenta' size = {50} onPress={() => this.props.navigation.navigate('Search')}>
            <Icon name="md-search" style={styles.actionButtonIcon}/>
          </ActionButton.Item>

          

          <ActionButton.Item buttonColor='crimson' size = {50} onPress={() => this.props.navigation.navigate('Upload')}>
            <Icon name="md-cloud-upload" style={styles.actionButtonIcon} size = {50} />
          </ActionButton.Item>
          
          <ActionButton.Item buttonColor='lime' size = {60} onPress={() => this.props.navigation.navigate('Message')}>
            <Icon name="ios-chatbubbles" style={styles.actionButtonIcon} size = {50} />
          </ActionButton.Item>

            </ActionButton>
            
               
                    
              
                

                    




                

                </View>
           
        );
    }
}

const styles = StyleSheet.create({

    buttonContainer: {
        height: 50,
        width: 150,
        position: "absolute",
        top: 10,
        left: 200,
       
        
    },
    

     followerBar: {
        height: 30,
        width: 280,
        flexDirection: 'row',
        alignItems: 'flex-start',
        top:10,
        
        
    },

    
    followerName: {
        marginLeft: 10,
        color: 'white',
        fontSize: 15,
        fontWeight: '400',
        
    },

    
    followerPic: {
        height: 60,
        width: 60,
        borderRadius: 35,
        borderColor: 'white',
        borderWidth: 1,
        top: 10
        
        
       
    },


    followerContainer: {
        width: 100 + "%",
        height: 80,
        backgroundColor: 'black',
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
       
        
    },
    
  button: {
    padding:5,
    backgroundColor: 'black',
    borderColor: 'gray',
    borderRadius: 1,
    borderWidth: 1,
    alignItems: 'center'
    
    
  }
});


export default withNavigation(Follower);