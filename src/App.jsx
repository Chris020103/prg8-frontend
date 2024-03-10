import {useEffect, useState} from 'react';
import './App.css';

function App() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [licensePlate, setLicensePlate] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(messages.length === 0){
            setMessages(currentMessages => [...currentMessages, {user: 'licensePlate', value: inputValue}]);
        }else{
            setMessages(currentMessages => [...currentMessages, {user: 'user', value: inputValue}]);
        }
        setLoading(true);
        await fetch('http://145.24.223.79:8000/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-headers': 'Origin, Content-Type, Accept',
                'Accept': 'application/json',
                'access-control-allow-origin': '*'
            },
            credentials: "same-origin",
            body: JSON.stringify({query: inputValue, history: messages})
        }).then(response => response.json()).then(data => {
            setMessages(currentMessages => [...currentMessages, {user: 'bot', value: data}]);
            if(licensePlate){
                setLicensePlate(false);
            }
            setLoading(false);
            setInputValue('');
            if(messages.length === 0){
                addToLocalStorage([{user: 'user', value: inputValue}, {user: 'bot', value: data}]);
            }else{
                addToLocalStorage([...messages, {user: 'user' , value: inputValue}, {user: 'bot', value: data}]);
            }
        }).catch(error => console.log(error));

    };

    const addToLocalStorage = (newMessages) => {
        localStorage.setItem('messages', JSON.stringify(newMessages));

    }

    useEffect(() => {
        if(localStorage.getItem('messages')){
            setMessages(JSON.parse(localStorage.getItem('messages')));
            if(localStorage.getItem('messages').length === 0){
                setLicensePlate(true);
            }
        }else{
            localStorage.setItem('messages', JSON.stringify([]));
            setLicensePlate(true);
        }
    }, []);

    return (
        <div className="App" >
            <div className="col-10">
                <div className="row white-border">
                    <div className="col-12">
                        <h1 className={'header-text'}>Auto chatbot</h1>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6 form-div">
                                <h2 className={'text-white'}>Vul hier je vraag in</h2>
                                <form onSubmit={handleSubmit} className={'d-flex justify-content-center'}>
                                    <div className="row">

                                    <div className="col-12">
                                        {licensePlate ? <div className="kenteken">
                                            <div className="inset">
                                                <div className="blue"></div>
                                                <input type="text" placeholder="XP-004-T" onChange={(e) => setInputValue(e.target.value)} />                                            </div>
                                        </div>  :   <textarea
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                className="form-control"
                                            />
                                        }

                                    </div>
                                        <div className="col-12 justify-content-end d-flex mt-3">
                                            <button type="button" disabled={!loading} className="btn btn-primary" onClick={() => {
                                                fetch('http://145.24.223.79:8000/ai/chat', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'access-control-allow-headers': 'Origin, Content-Type, Accept',
                                                        'Accept': 'application/json',
                                                        'access-control-allow-origin': '*'
                                                    },
                                                    credentials: "same-origin",
                                                    body: JSON.stringify({query: 'reset', history: messages})
                                                }).then(response => response.json()).then(data => {console.log(data)}).catch(error => console.log(error));
                                            }}>Cancel</button>
                                            <button type="submit" disabled={inputValue === '' || loading} className="btn btn-primary">Verstuur</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-6 messages-overview">
                                <h2 className={'text-white'}>Chatbot chat</h2>
                                <div className={'messages'}>
                                    {messages.map((message, index) => {

                                        return(
                                            <div key={index} title={message.value} className={`chat-field ${message.user === 'user' || message.user === 'licensePlate' ? 'bubble left' : 'bubble right'}` }>
                                                <p className={`${message.user === 'user' ? 'user-input' : 'bot-input'}` } key={index}>{message.user}: {message.value}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                                {loading && <span className="loader"></span>}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
