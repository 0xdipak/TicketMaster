import React from "react";

const Withdraw = ({ account, ownerAddress, ticketMaster, provider }) => {
  const withdraw = async () => {
    const signer = provider.getSigner();
    const txn = await ticketMaster.connect(signer).withdraw();
    await txn.wait();
  };
  return (
    <button onClick={withdraw} className="text-white text-sm border px-3 py-3 rounded-full hover:bg-white/10">
      Withdraw
    </button>
  );
};

export default Withdraw;
