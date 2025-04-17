using Microsoft.AspNetCore.Mvc;
using Server_Side.DAL;
using Server_Side.BL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.IO;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging; // Added for potential logging

namespace Server_Side.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserDBservices _userDBservices;
        private readonly Cloudinary _cloudinary;
        private readonly IOptions<CloudinarySettings> _cloudinarySettings;
        private readonly ILogger<UserController> _logger; // Added for logging

        public UserController(UserDBservices userDBservices, IOptions<CloudinarySettings> cloudinarySettings, ILogger<UserController> logger)
        {
            _userDBservices = userDBservices;
            _cloudinarySettings = cloudinarySettings;
            _logger = logger;

            Account account = new Account(
                _cloudinarySettings.Value.CloudName,
                _cloudinarySettings.Value.ApiKey,
                _cloudinarySettings.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User user)
        {
            // Existing registration logic...
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

        [HttpPost("UpdateProfileImage")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateProfileImage([FromForm] string userId, [FromForm] IFormFile image)
        {
            _logger.LogInformation($"Received UpdateProfileImage request for userId: {userId}");

            if (image == null || image.Length == 0)
            {
                _logger.LogWarning("Received request with null or empty image.");
                return BadRequest(new { message = "Please provide an image file." });
            }

            _logger.LogInformation($"Received image: FileName={image.FileName}, Length={image.Length}");

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new { message = "User ID is required." });
            }

            try
            {
                using (var stream = image.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(image.FileName, stream),
                        PublicId = $"UserPictures/{userId}",
                        Overwrite = true
                    };
                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.Error != null)
                    {
                        _logger.LogError($"Cloudinary upload failed for user {userId}: {uploadResult.Error.Message}");
                        return StatusCode(500, new { message = $"Cloudinary upload failed: {uploadResult.Error.Message}" });
                    }

                    var imageUrl = uploadResult.SecureUrl.ToString();

                    bool updateResult = await _userDBservices.UpdateUserProfileImageAsync(userId, imageUrl);

                    if (updateResult)
                    {
                        return Ok(new { message = "Profile image updated successfully!", imageUrl = imageUrl });
                    }
                    else
                    {
                        return NotFound(new { message = $"User with ID '{userId}' not found." });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred while updating profile image for user {userId}: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while updating the profile image", error = ex.Message });
            }
        }

        [HttpDelete("DeleteUser/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new { message = "User ID is required." });
            }

            bool result = await _userDBservices.DeleteUserAsync(userId);
            if (result)
            {
                return Ok(new { message = "User deleted successfully" });
            }
            else
            {
                return NotFound(new { message = $"User with ID '{userId}' not found." });
            }
        }


        [HttpPut("UpdateUser/{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, [FromBody] User updatedUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrEmpty(userId) || updatedUser == null)
            {
                return BadRequest(new { message = "User ID and updated user data are required." });
            }

            bool result = await _userDBservices.UpdateUserAsync(userId, updatedUser);
            if (result)
            {
                return Ok(new { message = "User updated successfully" });
            }
            else
            {
                return NotFound(new { message = $"User with ID '{userId}' not found." });
            }
        }
    }
}