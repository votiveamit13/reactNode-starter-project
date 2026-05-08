import Staff from "../models/Staff.mjs";
import Bid from "../models/Bid.mjs";
import Portal from "../models/Portal.mjs";
import BidType from "../models/BidType.mjs";

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const staff = await Staff.findOne({
      where: { email, password }
    });

    if (staff) {
      res.json({ success: true, data: staff });
    } else {
      res.json({ success: false, msg: "Invalid login" });
    }
  } catch (err) {
    res.json({ success: false, msg: "DB Error", error: err });
  }
};

// ADD BID
// export const addBid = async (req, res) => {
//   const {
//     staff_id,
//     portal_id,
//     bid_url,
//     date,
//     time,
//     price,
//     bid_type_id,
//     remark,
//     response = "No"
//   } = req.body;

//   try {
//     await Bid.create({
//       staff_id,
//       portal_id,
//       bid_url,
//       date,
//       time,
//       price,
//       bid_type_id,
//       remark,
//       response
//     });

//     res.json({ success: true, msg: "Bid Added" });
//   } catch (err) {
//     res.json({ success: false, error: err });
//   }
// };
export const addBid = async (req, res) => {
  const {
    staff_id,
    portal_id,
    bid_url,
    price,
    bid_type_id,
    remark,
    response = "No"
  } = req.body;

  try {
    // Get current system date & time
    const now = new Date();

    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(" ")[0]; // HH:MM:SS

    await Bid.create({
      staff_id,
      portal_id,
      bid_url,
      date,
      time,
      price,
      bid_type_id,
      remark,
      response
    });

    res.json({ success: true, msg: "Bid Added" });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};


// UPDATE RESPONSE (Popup)
export const updateResponse = async (req, res) => {
  const { id, response, client_remark, status } = req.body;

  try {
    await Bid.update(
      { response, client_remark, status },
      { where: { id } }
    );

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
};

// GET BIDS (Dashboard)
export const getBids = async (req, res) => {
  const { staff_id } = req.params;

  try {
    const bids = await Bid.findAll({
      where: { staff_id },
      include: [
        { model: Portal, attributes: ['name'] },
        { model: BidType, attributes: ['name'] }
      ]
    });

    // Format response to match old structure
    const formattedBids = bids.map(bid => ({
      ...bid.toJSON(),
      portal_name: bid.Portal?.name,
      bid_type_name: bid.BidType?.name
    }));

    res.json(formattedBids);
  } catch (err) {
    res.json({ error: err });
  }
};