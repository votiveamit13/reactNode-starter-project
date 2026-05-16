import sequelize from "../config/db.mjs";
import { QueryTypes } from "sequelize";


// GET EVENTS
export const getEvents = async (req, res) => {

  try {

    const events = await sequelize.query(
      `SELECT
          e.*,
          c.name AS category_name
       FROM events e

       LEFT JOIN event_categories c
       ON e.category_id = c.id

       ORDER BY e.id DESC`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json(events);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};


// ADD EVENT
export const addEvent = async (req, res) => {

  try {

    const {
      category_id,
      title,
      sub_title,
      organizer_name,
      event_date,
      start_time,
      end_time,
      venue_address,
      price,
      number_of_person,
      description,
      policy_description,
      wifi_available,
      rules_regulations,
      waste_disposal_time,
      status,
    } = req.body;

    const image = req.file
      ? `/uploads/events/${req.file.filename}`
      : null;

    await sequelize.query(
      `INSERT INTO events
      (
        category_id,
        title,
        sub_title,
        organizer_name,
        event_date,
        start_time,
        end_time,
        venue_address,
        price,
        number_of_person,
        description,
        image,
        policy_description,
        wifi_available,
        rules_regulations,
        waste_disposal_time,
        status
      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          category_id,
          title,
          sub_title,
          organizer_name,
          event_date,
          start_time,
          end_time,
          venue_address,
          price,
          number_of_person,
          description,
          image,
          policy_description,
          wifi_available,
          rules_regulations,
          waste_disposal_time,
          status,
        ],
      }
    );

    res.json({
      msg: "Event added successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });

  }

};


// UPDATE EVENT
export const updateEvent = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      category_id,
      title,
      sub_title,
      organizer_name,
      event_date,
      start_time,
      end_time,
      venue_address,
      price,
      number_of_person,
      description,
      policy_description,
      wifi_available,
      rules_regulations,
      waste_disposal_time,
      status,
    } = req.body;

    let imageQuery = "";

    let replacements = [
      category_id,
      title,
      sub_title,
      organizer_name,
      event_date,
      start_time,
      end_time,
      venue_address,
      price,
      number_of_person,
      description,
      policy_description,
      wifi_available,
      rules_regulations,
      waste_disposal_time,
      status,
    ];

    if (req.file) {

      imageQuery = ", image=?";

      replacements.push(
        `/uploads/events/${req.file.filename}`
      );
    }

    replacements.push(id);

    await sequelize.query(
      `UPDATE events SET

        category_id=?,
        title=?,
        sub_title=?,
        organizer_name=?,
        event_date=?,
        start_time=?,
        end_time=?,
        venue_address=?,
        price=?,
        number_of_person=?,
        description=?,
        policy_description=?,
        wifi_available=?,
        rules_regulations=?,
        waste_disposal_time=?,
        status=?
        ${imageQuery}

      WHERE id=?`,
      {
        replacements,
      }
    );

    res.json({
      msg: "Event updated successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};


// DELETE EVENT
export const deleteEvent = async (req, res) => {

  try {

    const { id } = req.params;

    await sequelize.query(
      `DELETE FROM events WHERE id=?`,
      {
        replacements: [id],
      }
    );

    res.json({
      msg: "Event deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });

  }

};