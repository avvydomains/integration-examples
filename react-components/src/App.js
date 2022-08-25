import logo from './logo.svg';
import './App.css';
import EVMAddress from './EVMAddress.js'
import EVMForm from './EVMForm.js'

function App() {
  return (
    <div className="App" style={{ padding: '20px', maxWidth: '300px', margin: 'auto' }}>
      <div>
        <div style={{'fontWeight': 'bold'}}>Example #1.</div>
        <div style={{'marginBottom': '10px', textAlign: 'left'}}>{'This form expects an EVM address. If you enter a .avax name (try avvy.avax), the form attempts to resolve the name into an EVM address before submitting the form.'}</div>
        <EVMForm />
      </div>
      <div style={{ margin: '40px 0', width: '100%', height: '1px', backgroundColor: '#ddd' }}></div>
      <div style={{ paddingBottom: '20px' }}>
        <div style={{'fontWeight': 'bold'}}>Example #2.</div>
        <div style={{'marginBottom': '10px', textAlign: 'left'}}>{'This textarea displays an EVM address. After displaying, it attempts to load in a related .avax name, and if found it shows it.'}</div>
        <EVMAddress address='0xc6fED32F84fca103E946eB21Ad16fD7887a3CEc5' />
      </div>
    </div>
  );
}

export default App;
