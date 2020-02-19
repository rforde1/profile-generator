const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const generateHTML = require("./generateHTML");

const questions = [
  {
      type: "list",
    name: "color",
    message: "What is your favorite color?",
    choices: ["blue", "red","green", "pink"]
  },
  {
    type :"input",
    name: "username",
    message: "What is your Github username",
    
  }
];
userProfile();


  async function userProfile(){
  const userInfo = await getQuestions();
  console.log(userInfo.username);
  const user = await userInput(userInfo.username);
  console.log(user)
  const repos = await getRepos(userInfo.username);
  const stars = getStars(repos);
   const newProfile = new Profile(
    user.data.avatar_url,
    user.data.login,
    user.data.location,
    user.data.bio,
    user.data.repos_url,
    user.data.followers,
    user.data.following,
    stars,
    userInfo.color
    );
    
  

  // }
  }
  

const Profile = function(profileimage, username, location, bio, repos,followers, following, stars, color){
  this.profileimage = profileimage;
  this.username = username;
  this.location = location;
  this.bio = bio;
  this.repos = repos;
  this.followers = followers;
  this.following = following;
  this.stars = stars;
  this.color =color;
}

const queryUrl = `https://api.github.com/users/`;


function userInput(username){
  console.log(queryUrl + username);
 return axios.get(queryUrl + username).catch( e =>{
    console.log(" I have error retreving results")
  });
 
}

function getRepos(username){
  return axios.get(queryUrl + username + "/repos").catch(e =>{
    console.log("I have an error getting repos");
  });
}

function getQuestions(){
  return inquirer.prompt(questions);
  // returning questions
}

function getStars (repo){
  let stars = 0;
  repo.data.forEach(starCount =>{
    stars += starCount.stargazers_count;
  })
  return stars;
}

function writeToFile(fileName, data) {
    
}