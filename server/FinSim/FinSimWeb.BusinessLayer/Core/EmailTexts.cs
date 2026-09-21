namespace FinSim.BusinessLayer.Core;

public enum CodeEmailKind
{
    Register,
    ChangePassword,
    ResetPassword
}

public static class EmailTexts
{
    public sealed record Content(string Subject, string Heading, string Intro, string Footer);

    public static Content Get(CodeEmailKind kind, string language, int expiryMinutes)
    {
        return language switch
        {
            AppLanguage.English => new Content(
                "Your FinSim code",
                kind switch
                {
                    CodeEmailKind.Register => "Confirm your registration",
                    CodeEmailKind.ChangePassword => "Confirm your password change",
                    _ => "Reset your password"
                },
                kind switch
                {
                    CodeEmailKind.Register => "Use the code below to finish creating your FinSim account.",
                    CodeEmailKind.ChangePassword => "Use the code below to confirm the password change for your FinSim account.",
                    _ => "Use the code below to reset the password of your FinSim account."
                },
                $"The code expires in {expiryMinutes} minutes. If you did not request this, you can ignore this email."),

            AppLanguage.Russian => new Content(
                "Твой код FinSim",
                kind switch
                {
                    CodeEmailKind.Register => "Подтверди регистрацию",
                    CodeEmailKind.ChangePassword => "Подтверди смену пароля",
                    _ => "Сброс пароля"
                },
                kind switch
                {
                    CodeEmailKind.Register => "Используй код ниже, чтобы завершить создание аккаунта FinSim.",
                    CodeEmailKind.ChangePassword => "Используй код ниже, чтобы подтвердить смену пароля аккаунта FinSim.",
                    _ => "Используй код ниже, чтобы сбросить пароль аккаунта FinSim."
                },
                $"Код действителен {expiryMinutes} мин. Если это был не ты, просто проигнорируй это письмо."),

            _ => new Content(
                "Codul tău FinSim",
                kind switch
                {
                    CodeEmailKind.Register => "Confirmă înregistrarea",
                    CodeEmailKind.ChangePassword => "Confirmă schimbarea parolei",
                    _ => "Resetează parola"
                },
                kind switch
                {
                    CodeEmailKind.Register => "Folosește codul de mai jos ca să îți finalizezi crearea contului FinSim.",
                    CodeEmailKind.ChangePassword => "Folosește codul de mai jos ca să confirmi schimbarea parolei contului tău FinSim.",
                    _ => "Folosește codul de mai jos ca să îți resetezi parola contului FinSim."
                },
                $"Codul expiră în {expiryMinutes} minute. Dacă nu ai cerut tu asta, poți ignora acest email.")
        };
    }
}
