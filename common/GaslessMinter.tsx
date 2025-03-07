import { useAuth } from "@common/AuthProvider";
import { useState } from "react";
import Confetti from "react-confetti";

export default function GaslessMinter() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const [txHash, setTxHash] = useState("");
  async function handleMint() {
    try {
      setIsLoading(true);
      const data = {
        userId: user?.userId,
        userScwAddress: user?.scwAddress,
        nameOfFunction: "mint",
      };

      const response = await fetch("/api/mint-nft-user-op/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          console.log("Response status:", res.status);
          return res.json(); // Parse response body as JSON
        })
        .then((data) => {
          console.log("i want this to run....2");
          console.log("res", data?.receipt);
          setTxHash(`https://sepolia.etherscan.io/tx/${data?.receipt}`);
          return data;
        });
      //  .catch((error) => {
      //    console.error("Error fetching:", error);
      //  });
      console.log("response-----", await response.data);
      setTimeout(() => {}, 10000); // 10 seconds
      setIsLoading(false);
      setHasMinted(true);
    } catch (error) {}
  }
  return (
    <div className="flex items-center justify-center mt-12">
      {hasMinted ? <Confetti /> : ""}
      <div className="card lg:card-side shadow-xl w-[70%] mb-16">
        <figure>
          <img
            src="https://github-production-user-asset-6210df.s3.amazonaws.com/83442423/267730896-dd9791c9-00b9-47ff-816d-0d626177909c.png"
            alt="sample nft"
          />
        </figure>

        <div className="card-body text-black">
          <h2 className="card-title text-2xl">
            Generic Pudgy Penguin on Sepolia
          </h2>
          <p className="text-sm">
            You are about to mint a fake NFT purely for testing purposes. The
            NFT will be minted directly to your smart contract wallet!
          </p>
          <div className="flex items-center justify-end">
            <div
              className={`alert w-[75%] mr-4 ${
                hasMinted ? "visible" : "hidden"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex justify-end text-right">
                <span className="text-white">NFT minted. ✅</span>
              </div>
            </div>
            <button className="btn btn-primary text-white" onClick={handleMint}>
              <span
                className={`${
                  isLoading ? "loading loading-spinner" : "hidden"
                }`}
              ></span>
              {isLoading ? "Minting" : hasMinted ? "Mint Again" : "Mint"}
              {txHash != "" ? txHash : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
