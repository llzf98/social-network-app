import React, { useState, useEffect } from "react";
import { Tabs, message, Row, Col, Button } from "antd";
import axios from "axios";

import SearchBar from "./SearchBar";
import PhotoGallery from "./PhotoGallery";
// import CreatePostButton from "./CreatePostButton";
import { SEARCH_KEY, BASE_URL, TOKEN_KEY } from "../constants";
import CreatePostButton from "./CreatePostButton";

const { TabPane } = Tabs;

function Home(props) {
    // state: post, search option, active tab
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("image");
    const [searchOption, setSearchOption] = useState({
        type: SEARCH_KEY.all,
        keyword: ""
    });

    // component life cycle
    // case 1: do search first time -> did mount -> search: {type: all, value:""}
    // case 2: do search after first time -> did update -> search: {type: keyword user, value}
    useEffect(() => {
        // fetch posts from the server
        const {type, keyword} = setSearchOption;
        fetchPost(searchOption)
    }, [searchOption]);

    const fetchPost = (option) => {
        // step 1: get search type / search context
        // step 2: fetch posts from the server
        // step 3: analyze the response from the server
        //  case 1: success -> display posts => images / video
        //  case 2: failed -> inform user
        const { type, keyword } = option;
        let url = "";

        if (type === SEARCH_KEY.all) {
            url = `${BASE_URL}/search`;
        } else if (type === SEARCH_KEY.user) {
            url = `${BASE_URL}/search?user=${keyword}`;
        } else {
            url = `${BASE_URL}/search?keywords=${keyword}`;
        }

        const opt = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };

        axios(opt)
            .then( res => {
                if (res.status === 200) {
                    console.log(res.data);
                    setPosts(res.data);

                }
            })
            .catch( err => {
                message.error("Fetch posts failed!");
                console.log("fetch posts failed: ", err.message);
            });
    };

    const renderPost = (type) => {
        // case 1: post is empty => return no data
        // case 2: display images
        // case 3: display videos
        if (!posts || posts.length === 0) {
            return <div>No Data!</div>
        }

        if (type === "image") {
            // render images
            // [1, 2, 3, 4, 5].filter(item => item !== 3)
            const imgArr = posts
                .filter( item => item.type === "image")
                .map( item => {
                    return {
                        postId: item.id,
                        src: item.url,
                        user: item.user,
                        caption: item.message,
                        thumbnail: item.url,
                        thumbnailWidth: 300,
                        thumbnailHeight: 200
                    }
                })
            return <PhotoGallery images={imgArr} />
        } else if (type === "video") {
            // render videos
            return (
                <Row gutter={32}>
                    {posts
                        .filter((post) => post.type === "video")
                        .map((post) => (
                            <Col span={8} key={post.url}>
                                <video src={post.url} controls={true} className="video-block"/>
                                <p>
                                    {post.user}: {post.message}
                                </p>
                            </Col>
                        ))}
                </Row>
            );
        }
    };

    const handleSearch = (option) => {
        // console.log('option => ', option)
        const { type, keyword } = option;
        setSearchOption({ type: type, keyword: keyword });
    };

    const showPost = type => {
        setActiveTab(type);
        setTimeout( () => {
            setSearchOption({
                type: SEARCH_KEY.all,
                value: ""
            })
        }, 3000)
    }

    const operations = <CreatePostButton onShowPost={showPost} />

    return (
        <div className="home">
            <SearchBar handleSearch={handleSearch}/>
            <Tabs defaultActiveKey="image"
                  activeKey={activeTab}
                  onChange={key => setActiveTab(key)}
                  tabBarExtraContent={operations}
            >
                <TabPane tab="Images" key="image">
                    { renderPost("image") }
                </TabPane>
                <TabPane tab="Videos" key="video">
                    { renderPost("video") }
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Home;