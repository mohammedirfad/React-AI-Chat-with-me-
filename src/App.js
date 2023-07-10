import "./App.css";
import { Configuration, OpenAIApi } from "openai";


import { arrayItems } from "./AIOption";
import { useState } from "react";
import Translation from "./Components/Transilation";
import OptionSelection from "./Components/OptionSelection";

function App() {
  const configuration = new Configuration({
    apiKey:"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",
  });
  const openai = new OpenAIApi(configuration);
  const [option, setOption] = useState({});
  const [result, setResult] = useState("");
  const [input, setInput] = useState("");
  // console.log(import.meta.env.VITE_Open_AI_Key);
  const selectOption = (option) => {
    setOption(option);
  };

  // const doStuff = async () => {
  //   let object = { ...option, prompt:input };

  //   const response = await openai.createCompletion(object);

  //   setResult(response.data.choices[0].text);
  // };
  // console.log(option);
  const doStuff = async () => {
    let object = { ...option, prompt: input };

    await callOpenAI(object);
  };

  const callOpenAI = async (object, numRetries = 3, delayMs = 1000) => {
    try {
      const response = await openai.createCompletion(object);
      setResult(response.data.choices[0].text);
    } catch (error) {
      if (error.response && error.response.status === 429 && numRetries > 0) {
        console.log('Rate limit exceeded. Retrying...');
        await delay(delayMs);
        await callOpenAI(object, numRetries - 1, delayMs * 2);
      } else {
        console.error('Error:', error);
      }
    }
  };

  const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  return (
    <div className="App">
      {Object.values(option).length === 0 ? (
        <OptionSelection arrayItems={arrayItems} selectOption={selectOption} />
      ) : (
        <Translation doStuff={doStuff} setInput={setInput} result={result}/>
      )}
    </div>
  );
}

export default App;
