export const mintNFT = async (fid: number, address: string) => {
  const crossmintURL = `https://${process.env.CROSSMINT_ENV}.crossmint.com/api/2022-06-09/collections/${process.env.CROSSMINT_COLLECTION_ID}/nfts/${fid}`;
  const addressC = `base-sepolia:${address}`;

  const options = {
    method: "PUT",
    headers: {
      "X-API-KEY": process.env.CROSSMINT_API_KEY!,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      recipient: addressC,
      metadata: {
        name: `Chessmates # ${fid}`,
        image: "ipfs://QmQVim5vtoDRnysKxD8vdZYssWJbZ5Ym163bhNLhVBHiR7/nft.png",
        description: `This is a unique NFT for the user with the fid ${fid}. Generated by Chessmates.`,
        attributes: [
          {
            display_type: "number",
            trait_type: "score",
            value: "0",
          },
        ],
      },
      reuploadLinkedFiles: true,
    }),
  };

  const req = await fetch(crossmintURL, options);
  const res = await req.json();

  return res;
};
