/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req);
  const id = req.query.id;

  const users = [
    {
      id: 1,
      name: "John Doe",
    },
    {
      id: 2,
      name: "Anderson",
    },
    {
      id: 3,
      name: "Mivane",
    },
  ];
  return res.json(users);
};
