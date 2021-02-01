import './App.css';
import React from 'react';

class App extends React.Component{ 

  state = {
    //parameters of marker
    name : "",  
    lat  : null,
    lng : null,

    //parameters for UI
    successMessage:  "",
    errorMessage : "",
    showingAlert: false
  };


  handleChangedName(e){
    let value = e.target.value;
    value = value.replace(/[^0-9|a-z|A-Z|-]/,'');
    this.setState({name: value});
  }
 
  checkValidDouble(userInput) {

    userInput = userInput.replace(/[^0-9|/.|-]/, '');
    userInput = userInput.replace('/', '');

    return userInput;
  }

  handleChangeLat(e){

    let value = e.target.value;
    value = this.checkValidDouble(value);

    this.setState({lat: value});
  }

  handleChangeLng(e){
    
   let value = e.target.value
    value = this.checkValidDouble(value);

    this.setState({lng: value});
  }


  

  //click send from UI
  handleClick(e) {

    const requestItem = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: this.state.name , 
                            latitude: this.state.lat,
                            longitude: this.state.lng})
    };

        let local_host_path = "http://localhost:8000/";
        let web_server_path = "https://jennysmolensky.pythonanywhere.com/";
        
        let path = local_host_path + "add_marker";
        fetch(path, requestItem) //send POST request to server

      .then(response => {  //wait for request (if nessecary can change to async here)
        
        try {

            response.json().then( (data) => {
                console.log(data);
            
                if(data['Success'] == 'Failed')
                    this.handleServerError(data['ErrorMessage']);
                else
                  this.handleServerSuccess();
              });
        
            } catch(erroe){
               console.log(console.error());
            }
      })
      .catch(error => {       //not connected

          this.handleServerError("Server is down");
          console.error('There was an error!', error);
      });
  }


  //alert from server will be seen for 2 seconds
  showAlert() {
    this.setState({
      showingAlert: true
    });
    setTimeout(() => {
      this.setState({
        showingAlert: false
      });
    }, 2000);
  }

  //error handling 
  handleServerError(error) {

    this.setState({successMessage: "Filed to add marker"})
    this.setState({errorMessage: error});
    this.showAlert();
    
    console.log("marker not added, due to: " + error);
  }

  //successfully add marker
  handleServerSuccess(){

    this.setState({successMessage: "Added succesfully"})
    this.setState({errorMessage: ""});
    this.showAlert();
    
    console.log("marker added");
  }

render(){
  return (
    <div className="main_div">
       
        <h1>Entities Creator</h1>

          <div className="coordinates">

                <p className="title"> Enter coordinates to mark on the map  </p>
                <div className="link-row" >
                <a  target="_blank" href="https://www.latlong.net">you can search a country or place here</a>
                <p className="info">Range of latitude is -90 and +90.   Range of longitude is -180 and +180, </p>
                </div>
                
                {/* row of element name */}
                <div className="row" > 

                    <div className="col-1">
                          <p className="label">Name </p>
                    </div>
                    
                    <div className="col-2">
                        <input  className="input-element" placeholder="Narnia"
                                value={this.state.name}
                                onChange={(e) => this.handleChangedName(e)}/>
                    </div>

                  </div>


                {/* row of element latitude */}
                <div className="row" >

                    <div className="col-1">
                          <p className="label">latitude </p>
                      </div>
                      
                    <div className="col-2">
                        <input className="input-element" placeholder={"GPS coordinates"}
                               value={this.state.lat} onChange={(e) => this.handleChangeLat(e)}/>
                    </div>

                </div>

                {/* row of element longtitude */}
                <div className="row" >

                   <div className="col-1">
                        <p className="label">longitude </p>
                   </div>
                    
                  <div className="col-2">
                      <input  value={this.state.lng} className="input-element"
                              placeholder={"GPS coordinates"}
                              onChange={(e) => this.handleChangeLng(e)}/>
                  </div>

                </div>

                {/* row of element send cutton */}
                <div className="btn-row" >
                    <button className="send-btn" onClick={(e) => this.handleClick(e)}>Send</button>  
                </div>

                {/* row of element alert message */}
                <div className={`alert alert-success ${this.state.showingAlert ? 'alert-shown' : 'alert-hidden'}`}>
                    <p className="main-message">{this.state.successMessage}!</p>
                    <p className="error-message" >{this.state.errorMessage}</p>
            </div>            

          </div>
    </div>
  );
}

}

export default App;
