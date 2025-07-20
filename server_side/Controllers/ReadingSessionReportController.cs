using Microsoft.AspNetCore.Mvc;
using Server_Side.BL;
using Server_Side.DAL;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ReadingSessionReportController : ControllerBase
{
    private readonly ReadingSessionReportDBservices _db;

    public ReadingSessionReportController(ReadingSessionReportDBservices db)
    {
        _db = db;
    }

    // POST: api/ReadingSessionReport
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] ReadingSessionReport report)
    {
        if (report == null)
            return BadRequest("Invalid report");

        await _db.AddReportAsync(report);
        return Ok(new { message = "Report submitted successfully" });
    }

    // GET: api/ReadingSessionReport
    [HttpGet]
    public async Task<ActionResult<List<ReadingSessionReport>>> GetAll()
    {
        var reports = await _db.GetAllReportsAsync();
        return Ok(reports);
    }

    // GET: api/ReadingSessionReport/filter?storyId=...&userId=...&childId=...
    [HttpGet("filter")]
    public async Task<ActionResult<List<ReadingSessionReport>>> GetFiltered([FromQuery] string storyId, [FromQuery] string userId, [FromQuery] string childId)
    {
        var results = await _db.GetFilteredReportsAsync(storyId, userId, childId);
        return Ok(results);
    }
}
