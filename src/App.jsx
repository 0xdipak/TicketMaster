import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navigation from "./components/Navigation";
import Sort from "./components/Sort";
import Card from "./components/Card";
import SeatChart from "./components/SeatChart";

import ABI from "./utils/abi.json";
import { contractAddress, ownerAddress } from "./utils/constants";
import Withdraw from "./components/Withdraw";

function App() {
  const [account, setAccount] = useState();
  const [provider, setProvider] = useState();
  const [ticketMaster, setTicketMaster] = useState();
  const [occasions, setOccasions] = useState([]);
  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const ticketMaster = new ethers.Contract(contractAddress, ABI, provider);
    setTicketMaster(ticketMaster);

    const totalOccasions = await ticketMaster.totalOccasions();
    const occasions = [];
    for (var i = 1; i <= totalOccasions; i++) {
      const occasion = await ticketMaster.getOccasion(i);
      occasions.push(occasion);
    }

    setOccasions(occasions);
    console.log(occasions);

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);

    window.ethereum.on("accountChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <header>
        <Navigation
          account={account}
          setAccount={setAccount}
          ownerAddress={ownerAddress}
        />

        <h2 className="flex items-center justify-between mt-20 mx-10 lg:mx-56">
          <span className="text-white text-4xl">
            <strong>Event</strong> Tickets
          </span>
          {account === ownerAddress ? (
            <Withdraw
              account={account}
              ownerAddress={ownerAddress}
              ticketMaster={ticketMaster}
              provider={provider}
            />
          ) : (
            ""
          )}
        </h2>
      </header>
      <Sort />
      <div className="cards">
        {occasions.map((occasion, index) => (
          <Card
            key={index}
            occasion={occasion}
            id={index + 1}
            ticketMaster={ticketMaster}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
          />
        ))}
      </div>

      {toggle && (
        <SeatChart
          occasion={occasion}
          ticketMaster={ticketMaster}
          provider={provider}
          setToggle={setToggle}
        />
      )}
    </div>
  );
}

export default App;
