const axios = require('axios');
const db = require("../models");
bcrypt = require("bcryptjs");

const User = db.User;
const Op = db.Op;
const Specialization = db.Specialization;
const Language = db.Language;



class DashboardService{

    async searchDoctors(address, language, specialization, radius) {
        try {
          // Geocode the address
          const location = await this.geocodeAddress(address);
    
          // Build the query
          const query = this.buildQuery(location, radius, language, specialization);
    
          // Perform the search
          const doctors = await User.findAll(query);
    
          if (!doctors.length === 0 || doctors) {
            throw new Error("No doctors found");
          }
    
          return doctors;
        } catch (error) {
          throw error;
        }
      }
    
      async geocodeAddress(address) {
        try {
          const response = await axios.get(
            "http://api.positionstack.com/v1/forward",
            {
              params: {
                access_key: process.env.API_ACCESS_KEY,
                query: address,
              },
            }
          );
    
          const { latitude, longitude } = response.data.data[0];
          return { latitude, longitude };
        } catch (error) {
          throw new Error("Geocoding failed");
        }
      }
    
      buildQuery(location, radius, language, specialization) {
        const query = {
          where: {
            role: "doctor",
          },
          include: [
            {
              model: Specialization,
              attributes: ["area_of_specialization"],
             where: {},
            },
            {
              model: Language,
              attributes: ["language_name"],
             where: {},
            },
          ],
        };
    
        // Add location-based search if address is provided
        if (location) {
            query.where = {
              ...query.where,
              [Op.and]: db.Sequelize.where(
                db.Sequelize.fn(
                  'ST_Distance_Sphere',
                  db.Sequelize.col('location'),
                  db.Sequelize.fn('ST_GeomFromText', `POINT(${location.longitude} ${location.latitude})`)
                ),
                { [Op.lte]: radius * 1000 } // Convert km to meters
              ),
            };
          }

        // Add language filter if provided
        if (language) {
          query.include[1].where.language_name = {
            [Op.in]: Array.isArray(language) ? language : [language],
          };
        }
    
        // Add specialisation filter if provided
        if (specialization) {
          query.include[0].where.area_of_specialization = specialization;
        }
    
        return query;
      }


    // async findNearbyDoctors(location, radius, language, specialisation) {
    //     const query = {
    //       role: 'doctor',
    //       location: {
    //         [Op.near]: {
    //           $geometry: location,
    //           $maxDistance: radius,
    //         },
    //       },
    //     };
      
    //     const include = [];
      
    //     if (language) {
    //       include.push({
    //         model: Language,
    //         attributes: ['language_name'],
    //         where: {
    //           language_name: {
    //             [Op.in]: language.split(',')
    //           }
    //         }
    //       });
    //     }
      
    //     if (specialisation) {
    //       include.push({
    //         model: Specialization,
    //         attributes: ['area_of_specialization'],
    //         where: {
    //           area_of_specialization: specialisation
    //         }
    //       });
    //     }
      
    //     const doctors = await User.findAll({
    //       where: query,
    //       include: include
    //     });
      
    //     if (!doctors.length) {
    //       throw new Error("No doctor found");
    //     }
      
    //     return doctors;
    //   }
      

      
}


module.exports = new DashboardService();