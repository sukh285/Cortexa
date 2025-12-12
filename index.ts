import readline from "node:readline/promises";

//The async fn returns a promise but it doesn't return any meaningful data
async function main(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  //for continuous chat between ai and user
  while (true) {
    const userInput = await rl.question("You: ");
    console.log("You said:", userInput);
    
    if(userInput === 'exit') break;
  }

  //closes the interface
  rl.close();
}

main();
