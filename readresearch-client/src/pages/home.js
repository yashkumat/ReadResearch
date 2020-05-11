import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Posts from '../components/Posts';
import Profile from '../components/Profile';
import {connect} from 'react-redux';
import { getPosts} from '../redux/actions/dataActions';

class home extends Component {
   
    componentDidMount(){
       this.props.getPosts();
    }
  render() {
    const {posts, loading} = this.props.data;
    let postMarkup = !loading ? ( posts.map((post)=><Posts key={post.postId} post={post}/>)
    ) : (
      <p>Loading...</p>
    );
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {postMarkup}
          </Grid>
          <Grid item lg={4} xs={12}>
            <Profile />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data
})

export default connect(mapStateToProps, {getPosts})(home)
