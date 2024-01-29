using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ShapeDiverLight.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("MyCorsPolicy")]
    public class CommonController : ControllerBase
    {
        private readonly DatabaseHelper _dbHelper;

        public CommonController(DatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        [HttpPost]
        [Route("GetAuthenticate")]            
        public bool GetAuthenticate(UserDto input)
        {
            return input.UserName.ToLower() == "test" && input.Password.ToLower() == "test" ? true : false;
        }      
            

        // POST: api/Shipping/TransferInventory
        [HttpPost("InsertParamiters")]
        public async Task<ActionResult<bool>> InsertParamiters(ParameterDto request)
        {
            try
            {
                var sql = @"
            INSERT INTO Parameters (menuOption, seledModel,IsDeleted,LastUpdated) 
            VALUES (@menuOption, @seledModel,0,GETDATE())";
                await _dbHelper.ExecuteAsync(sql, request);
                return Ok(true);
            }
            catch (Exception ex)
            {
                return Ok(false);
            }
        }
    }

    public class UserDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class ParameterDto
    {
        public string menuOption { get; set; }
        public string seledModel { get; set; }
    }
}
