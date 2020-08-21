import React,{Component} from 'react';
import 'bootswatch/dist/minty/bootstrap.min.css'; // Added this :boom:
import "bootswatch/dist/cosmo/bootstrap.min.css";
import './App.css';
import Authorization from './components/Authorization'
import ThemeSelect from './components/ThemeSelect';



var authorization = new Authorization();
var themeSelect = new ThemeSelect()

class App extends Component {
  constructor(props){
    super(props);

    this.token = authorization.token
    this.name = authorization.name
    this.list = themeSelect.state.list
  
    this.state = {
      loggedIn: this.token ? true : false,
   

    }
  }

  render() {
    return (

      
      <>
      <div className="App">
      { !(this.state.loggedIn) &&

          <div>
            <Authorization/>
          </div>
  }
          { (this.state.loggedIn) &&

        <div>
          <ThemeSelect
           token={this.token}
           name={this.name}
          />
        </div>
  }
      </div>
      </>
  
      
        
       
    );
  }
}

export default App;

