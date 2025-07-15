using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using Server_Side.BL;

public class CloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IOptions<CloudinarySettings> options)
    {
        var settings = options.Value;

        if (string.IsNullOrWhiteSpace(settings.CloudName) ||
            string.IsNullOrWhiteSpace(settings.ApiKey) ||
            string.IsNullOrWhiteSpace(settings.ApiSecret))
        {
            throw new ArgumentException("Cloudinary credentials are missing in configuration.");
        }

        var account = new Account(settings.CloudName, settings.ApiKey, settings.ApiSecret);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadBase64ImageAsync(string base64, string publicId, string folderPath)
    {
        var bytes = Convert.FromBase64String(base64);
        using var stream = new MemoryStream(bytes);

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription($"{publicId}.jpg", stream),
            PublicId = $"{folderPath}/{publicId}",
            Folder = folderPath,
            Overwrite = true,
            Format = "jpg"
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult.SecureUrl.ToString();
    }
}
