using Microsoft.AspNetCore.Mvc;
using Server_Side.DAL;
using Server_Side.BL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Text;
//using System.Web.Script.Serialization;
using MongoDB.Bson.IO;

namespace Server_Side.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserDBservices _userDBservices; 

        public UserController(UserDBservices userDBservices) 
        {
            _userDBservices = userDBservices;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User user)
        {
            if (user == null || string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest(new { message = "Invalid user data" });
            }

            // בדיקת נתוני הורים
            if (user.ParentDetails == null || user.ParentDetails.Any(p =>
                string.IsNullOrWhiteSpace(p.FirstName) ||
                string.IsNullOrWhiteSpace(p.LastName) ||
                string.IsNullOrWhiteSpace(p.PhoneNumber)))
            {
                return BadRequest(new { message = "Each parent must have a first name, last name, and phone number" });
            }

            // בדיקת נתוני ילדים
            if (user.Children != null && user.Children.Any(c =>
                string.IsNullOrWhiteSpace(c.FirstName) ||
                //string.IsNullOrWhiteSpace(c.LastName) ||
                //string.IsNullOrWhiteSpace(c.Username) ||
                //string.IsNullOrWhiteSpace(c.Password) ||
                c.Birthdate == default ||
                c.ReadingLevel < 0))
            {
                return BadRequest(new { message = "Invalid child data" });
            }

            bool result = await _userDBservices.AddUserAsync(user); 
            if (result)
            {
                return Ok(new { message = "User created successfully" });
            }
            else
            {
                return BadRequest(new { message = "Email needs to be unique" });
            }
        }

        [HttpPut("addChild/{userEmail}")]
        public async Task<IActionResult> AddChild(string userEmail, [FromBody] Child child)
        {
            bool result = await _userDBservices.AddChildAsync(userEmail, child);
            if (result)
            {
                return Ok(new { message = "Child added User updated successfully" });
            }
            else
            {
                return BadRequest(new { message = "Bad request from client" });
            }
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetUsersAsync()
        {
            try
            {
                List<User> users = await _userDBservices.GetUsersAsync(); // שימוש ב- _userDBservices
                if (users == null || users.Count == 0)
                {
                    return NotFound(new { message = "No users found" });
                }
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving users", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] User user)
        {
            if (user == null || string.IsNullOrWhiteSpace(user.Username) || string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest(new { message = "Invalid username or password" });
            }

            // קריאה לפונקציה מתוך ה-DBservices
            var loggedInUser = await _userDBservices.LoginAsync(user.Username, user.Password);
            if (loggedInUser == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            return Ok(new { message = "Login successful", user = loggedInUser });
        }

        [HttpGet("GetUserById/{userId}")]
        public async Task<ActionResult<User>> GetUserById(string userId)
        {
            var user = await _userDBservices.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(); 
            }
            return Ok(user);
        }
    }
}
