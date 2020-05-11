import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Posts from '../components/Posts';
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';
import StaticProfile from '../components/StaticProfile';
import Button from '@material-ui/core/Button';

class user extends Component {
   
  state = {
    postIdParam:null,
    username:null
  };

  componentDidMount() {
    const username = this.props.match.params.username;
    this.setState({
      username
    })
    const postId = this.props.match.params.postId;
    
    if (postId) this.setState({ postIdParam: postId });

    this.props.getUserData(username);
  }

  handleBack() {
    window.location.href = "/";
  }

  render() {
    const { posts, loading } = this.props.data;

    const { postIdParam } = this.state;
    const postsMarkup = loading ? (
      <p>Loading...</p>
    ) : posts === null ? (
      <p>No Posts</p>
    ) : (
      !postIdParam ? (
          posts.map((post) => <Posts key={post.postId} post={post} />)
    ) : (
        posts.map((post) =>{
            if(post.postId !== postIdParam ){
                return  <Posts key={post.postId} post={post} />
            }else{
                return <Posts key={post.postId} post={post} openDialog={this.props.openDialog}/>
            }
        })
    )
    )
    return (
      <Grid container spacing={4}>
        <Grid item sm={12} xs={12}>
          <Button
            variant="contained"
            onClick={this.handleBack}
            color="secondary"
            justify="center"
          >
            Back
          </Button>
        </Grid>
        <Grid item sm={8} xs={12}>
          {postsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <StaticProfile username={this.state.username}/>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
    data: state.data
});

export default connect(
    mapStateToProps,
    { getUserData }
)(user);