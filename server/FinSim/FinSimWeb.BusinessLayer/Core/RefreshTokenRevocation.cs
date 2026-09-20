using FinSim.DataAccessLayer.Context;
using Microsoft.EntityFrameworkCore;

namespace FinSim.BusinessLayer.Core;

public static class RefreshTokenRevocation
{
    public static async Task RevokeAllRefreshTokensAsync(this AppDbContext context, int userId)
    {
        var activeTokens = await context.RefreshTokens
            .Where(t => t.UserId == userId && t.RevokedAt == null)
            .ToListAsync();

        var now = DateTime.UtcNow;
        foreach (var token in activeTokens)
            token.RevokedAt = now;
    }
}
