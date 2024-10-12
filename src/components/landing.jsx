import React from 'react';
import './landing.css';
import 'bootstrap/dist/css/bootstrap.css';
import madison from './assets/bachi.jpg';
import kala from './assets/kala.jpg';
import gora from './assets/gora.jpg';
import kali from './assets/kali.jpg';
import diagram from './assets/fypWorkflow.png'

function landing() {
  return (
    <div>
        <div className='ellipse'></div>
        <div className='ellipse1'></div>
      
        

    <div class="main-heading">
        <div>
            <center><h2 className="main-heading-text">Revolutionize</h2></center>
            <center><p className="main-heading-smalltext">Your Company’s Data Utilization with</p></center>
            <center><h2 className="main-heading-text">Retrieval Augmented Generation</h2></center>
        </div>
    </div>

    <div class="main-heading1">
        <div className="box">
            <center><p className="next-heading-smalltext">Introducing our innovative solution, "Retrieval Augmented Generation using Knowledge Graphs," a cutting-edge
             platform designed to revolutionize how companies let their users and prospective Customers interact with their data. By leveraging the power of Large Language Models 
             and advanced knowledge graphs (Neo4j), our product provides precise and contextually relevant answers to your queries, transforming data into actionable insights.</p></center>

        </div>
    </div>
    
    <div class="main-heading2">
        <div class="main-heading-smalltext">
            <center><p>What is Retrieval Augmented Generation?</p></center>
        </div>
        <div className="box">
            <center><p className="next-heading-smalltext">This is basically an intelligent agent, which can be explained as a question-answering system that utilizes knowledge graphs to provide accurate responses tailored to your company’s specific data. Unlike generic AI models, our solution is customized to integrate seamlessly with your company’s data, ensuring that the information you receive is relevant and precise.</p></center>
        </div>
    </div>

    <div class="main-heading3">
        <div class="main-heading-smalltext">
            <center><p>Features</p></center>
        </div>
    </div>

    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <div className="card custom-card">
            <img src={madison} className="card-img-top" alt="Card Title 1" />
            <div className="card-body">
              <h4 className="card-title">Customization</h4>
              <p className="card-text">Tailor the system to your company’s unique data sets.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card custom-card">
            <img src={kala} className="card-img-top" alt="Card Title 2" />
            <div className="card-body">
              <h4 className="card-title">Accuracy</h4>
              <p className="card-text">Leverage advanced knowledge graphs for precise answers.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card custom-card">
            <img src={gora} className="card-img-top" alt="Card Title 3" />
            <div className="card-body">
              <h4 className="card-title">Integration</h4>
              <p className="card-text">Easy integration with your website and data schema.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card custom-card">
            <img src={kali} className="card-img-top" alt="Card Title 4" />
            <div className="card-body">
              <h4 className="card-title">Efficiency</h4>
              <p className="card-text">Streamline processes, saving time and resources.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-heading4">
        <div class="main-heading-smalltext">
            <center><p>How Does Our System Work?</p></center>
        </div>
        <div className="box">
            <center><p className="next-heading-smalltext">Our solution harnesses the power of Gemini’s API to access and retrieve data from comprehensive knowledge graphs of Neo4j. Here’s how it functions:</p></center>
        </div>
    </div>
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <div className="card custom-card2">
            <div className="card-body2">
              <h4 className="card-title">Data Integration</h4>
              <p className="card-text">Connect your data to Neo4j, by uploading a PDF or providing website link.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card custom-card2">
            <div className="card-body2">
              <h4 className="card-title">Query Processing</h4>
              <p className="card-text">Users ask questions through a user-friendly interface and gets answer from the model.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card custom-card2">
            <div className="card-body2">
              <h4 className="card-title">Knowledge Graph Use</h4>
              <p className="card-text">The system taps into the knowledge graph to find the most relevant information.</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card custom-card2">
            <div className="card-body2">
              <h4 className="card-title">Response Generation</h4>
              <p className="card-text">Generates accurate and contextually appropriate responses.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-heading5">
        <div class="main-heading-smalltext">
            <center><p>Visual Aid</p></center>
        </div>
        <div className="box2">
            <center><p className="next-heading-smalltext">Our flow diagram:</p></center>
        </div>
        <img src={diagram} className="card-img-top" alt="Card Title 1" />
    </div>

    <div class="main-heading6">
        <div class="main-heading-smalltext">
            <center><p>Ready to Transform Your Data Utilization?</p></center>
        </div>
        <div className="box">
            <center><p className="next-heading-smalltext">Join the forefront of intelligent data retrieval and see how our solution can revolutionize your company’s decision-making processes.</p></center>
        </div>
    </div>
    </div>

    

  );
}

export default landing;
