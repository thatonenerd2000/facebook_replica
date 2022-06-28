import React, { useContext, useEffect, useState } from 'react'
import {ConfigContext} from '../GlobalContext';

import { Container, Row, Col } from 'react-bootstrap';

const Post = (props) => {
    const Globalconfig = useContext(ConfigContext)
    const post = props.postKey
    
    return(
        <div id="post">
            <Row>
                <Col xs={{span:1}}>
                    <img className="statusProPic" src={Globalconfig.userData.profile_picture}></img>
                </Col>
                <Col style={{padding:"0px"}} xs={{span:11}}>
                    <h6>{Globalconfig.userData.first_name} {Globalconfig.userData.last_name} <span style={{color:"#B0B3B8"}}>
                        {
                            Globalconfig.userData.posts.post_array[post].image !== "" ? "Uploaded an image" : "Posted a status"
                        }</span><br></br><span style={{color:"#B0B3B8"}}>{Globalconfig.userData.posts.post_array[post].date}</span></h6>
                </Col>
            </Row>
            <hr></hr>
            <Row>
                <p>{Globalconfig.userData.posts.post_array[post].caption}</p>
                <img style={{width:"100%", borderRadius:"20px"}} src={Globalconfig.userData.posts.post_array[post].image !== "" ? Globalconfig.userData.posts.post_array[post].image : ""}></img>
            </Row>
        </div>
    )
}

export default Post