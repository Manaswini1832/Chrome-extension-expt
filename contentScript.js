//Please run atleast now!!!

console.log("I'm the content script");

//Will get rid of this later since I only need the tweet IDs for now. But still lets see
// Functions
let tweetParser = async function (tweetDom) {
    let tweetContent = tweetDom.innerText;
    let tweet = {
      name: "",
      username: "",
      time: "",
      content: "",
      interaction: {
        reply: "",
        retweets: "",
        like: "",
      },
    };
    //console.log("Tweet Content", tweetContent)
    let timeElm = tweetDom.getElementsByTagName("time")[0];
    let timeDis = timeElm.innerText;
    //console.log("Tweet Time Element ",timeElm)
    let dateTimeAtri = timeElm.getAttribute("datetime");
    let splitTweet = tweetContent.split(/\n/);
    let splitLength = splitTweet.length;
    let breakpoint = 4;
    let endContent = splitLength - 4;
    for (let i = 0; i < splitLength; i++) {
      if (splitTweet[i] === timeDis) {
        breakpoint = i;
      }
    }
    //console.log("Split Tweet",splitTweet)
    tweet.name = splitTweet[0];
    tweet.username = splitTweet[1];
    tweet.time = dateTimeAtri;
    tweet.content = splitTweet.slice(breakpoint + 1, endContent + 1);
    tweet.content = tweet.content.join("\n");
    tweet.interaction.reply = splitTweet[endContent + 1];
    tweet.interaction.retweets = splitTweet[endContent + 2];
    tweet.interaction.like = splitTweet[endContent + 3];
    //console.log(tweet)
    return tweet;
  };
  
  async function getTweets() {
    // Function to get New Tweet Bodies
    let divs = document.querySelectorAll("div"); // Load Div Elements
  
    tweets = [];
    tweetIds = [];
  
    for (let div of divs) {
      //console.log(div.innerHTML)
      let dataTestId = div.getAttribute("data-testid");
      // data-tweet-id
      if (dataTestId == "tweet") {
        tweets.push(div);
      }
    } // Load Tweet Elements by checking for specific Attribute
  
    tweetContent = {};
    let parsedTweets = {};
  
    for (let tweet of tweets) {
      //console.log(tweet)
      let aTags = tweet.getElementsByTagName("a");
      for (let aTag of aTags) {
        let href = aTag.getAttribute("href");
        if (href.includes("/status/")) {
  
          let start = href.indexOf("/status/");
          let tweetId = href.split("/status/");
          tweetId = tweetId[1];
          if (!(tweetId in parsedTweets)) {
              //Beginning of experiment
            const tweetIDRegex = /\d+/;
            const enteredId = tweetId.match(tweetIDRegex)[0];

            // console.log("Printing experiment")
            // console.log(enteredId);


            //End of experiment
            tweetIds.push(enteredId);
            //console.log(tweet.innerText)
            parsedTweets[enteredId] = await tweetParser(tweet);
          }
        }
      } // Finding Tweet Id for every tweet by processing all <a> tags within the tweet
    } // Iterating through tweets
  
    return parsedTweets;
  }
  // ------- End of Functions ------
  
  // Main
  let main = async function () {
    let parsedTweetsGlobal = {};
    parsedTweetsGlobal = await getTweets();
  
    window.addEventListener("scroll", async function () {
      let newParsedTweets = await getTweets();
      console.log(
        "From Scroll Event Listener ",
        Object.keys(newParsedTweets).length
      );
      let newDistinctTweets = new Object();
      for (let newTweetID in newParsedTweets) {
        if (!(newTweetID in parsedTweetsGlobal)) {
          newDistinctTweets[newTweetID] = newParsedTweets[newTweetID];
          console.log("New Distinct Tweet from Scroll Event");
        }
      }
  
      parsedTweetsGlobal = { ...parsedTweetsGlobal, ...newParsedTweets };
      console.log(
        "New Key Length From Scroll Even",
        Object.keys(parsedTweetsGlobal).length
      );
      console.log(parsedTweetsGlobal);
      appendIcon();
    });
  };
  main();

async function appendIcon() {
    // Function to get New Tweet Bodies
    let divs = document.querySelectorAll("div"); // Load Div Elements
  
    tweets = [];
  
    for (let div of divs) {
      //console.log(div.innerHTML)
      let dataTestId = div.getAttribute("data-testid");
      // data-tweet-id
      if (dataTestId == "tweet") {
        tweets.push(div);
      }
    } // Load Tweet Elements by checking for specific Attribute
    

    for ( let tweet in tweets ){
        // const secondDiv = tweet.getElementsByTagName("div")[1];
        // console.log(secondDiv);

        console.log(tweet)
    }
}

{/* <div class="css-1dbjc4n r-18u37iz r-1h0z5md">
    <svg width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.0721 8.07127L15.8687 2.99715L23.0408 7.76504L17.0721 8.07127Z" fill="url(#paint0_linear)"></path>
      <path opacity=".99" d="M6.46739 7.83829L8.48589 12.0482L1.43826 9.17889L6.46739 7.83829Z" fill="url(#paint1_linear)"></path>
      <path d="M12.5802 10.0882L10.0628 15.3985L6.47659 7.85353L12.5802 10.0882Z" fill="url(#paint2_linear)"></path>
      <path d="M18.6933 14.4317L7.4478 20.9062L15.8848 2.98964L18.6933 14.4317Z" fill="#108AC7"></path>
      <defs>
        <linearGradient id="paint0_linear" x1="19.2" y1="6.546" x2="10.904" y2="1.981" gradientUnits="userSpaceOnUse">
          <stop stop-color="#63BAEF"></stop>
          <stop offset="1" stop-color="#539DCA"></stop>
          <stop offset="1" stop-color="#4B91BC"></stop>
        </linearGradient>
        <linearGradient id="paint1_linear" x1="11.644" y1="9.323" x2="2.988" y2="9.333" gradientUnits="userSpaceOnUse">
          <stop stop-color="#58A4D2"></stop>
          <stop offset=".782" stop-color="#0E93D6"></stop>
        </linearGradient>
        <linearGradient id="paint2_linear" x1="14.669" y1="12.714" x2="6.883" y2="11.737" gradientUnits="userSpaceOnUse">
          <stop stop-color="#43A1DA"></stop>
          <stop offset=".68" stop-color="#6EC5FA"></stop>
        </linearGradient>
      </defs>
    </svg>
</div> */}