import prisma from "@/lib/prisma";

const main = async () => {
  try {
    const users = await prisma.user.findMany({});

    const updateNFT = async (fid: number, points: number) => {
      const crossmintURL = `https://${process.env.CROSSMINT_ENV}.crossmint.com/api/2022-06-09/collections/${process.env.CROSSMINT_COLLECTION_ID}/nfts/${fid}`;

      const options = {
        method: "PATCH",
        headers: {
          "X-API-KEY": process.env.CROSSMINT_API_KEY!,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          metadata: {
            name: `Chessmates # ${fid}`,
            image:
              "ipfs://QmQVim5vtoDRnysKxD8vdZYssWJbZ5Ym163bhNLhVBHiR7/nft.png",
            description: `This is a unique NFT for the user with the fid ${fid}. Generated by Chessmates.`,
            attributes: [
              {
                display_type: "number",
                trait_type: "points",
                value: points.toString(),
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

    const promises = users.map(async (user) => {
      const score = user.points;
      await updateNFT(Number(user.fid), score);
    });

    await Promise.all(promises);

    return new Response("Success", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("Internal err", { status: 500 });
  }
};

export async function GET(request: Request) {
  return main();
}

export async function POST(request: Request) {
  return main();
}