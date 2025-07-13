using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Server_Side.BL;


public class CloudinaryService
{
    private readonly CloudinarySettings _cloudinary;

    public CloudinaryService(IConfiguration config)
    {
        var account = new Account(
            config["Cloudinary:CloudName"],
            config["Cloudinary:ApiKey"],
            config["Cloudinary:ApiSecret"]
        );
        _cloudinary = new CloudinarySettings(account);
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
