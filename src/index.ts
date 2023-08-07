import { ethers } from "ethers";

function getEth() {
    //@ts-ignore
    const eth = window.ethereum;
    if(!eth) throw new Error("need metamask");

    return eth;
}

async function hasAccounts() { 
        const eth = getEth();
        const accounts = await eth.request({method: "eth_accounts"}) as string[];

        return accounts && accounts.length;
}


async function requestAccounts() { 
        const eth = getEth();
        const accounts = await eth.request({method: "eth_requestAccounts"}) as string[];

        return accounts && accounts.length;
}

async function run() {
    if(!await hasAccounts() && !await requestAccounts()) throw new Error("Error in account request");

    const count = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        [
            "function count() public",
            "function viewCount() public view returns (uint32)",
        ],
        new ethers.providers.Web3Provider(getEth()).getSigner()
    );

    const el = document.createElement("div");
    async function setCount() {
        el.innerHTML = await count.viewCount();
    }
    setCount();

    const button = document.createElement("button");
    button.innerText = "increment";
    button.onclick = async ()=> {
        await count.count;
        setCount();
    }

    document.body.appendChild(el);
    document.body.appendChild(button);
}

run();





