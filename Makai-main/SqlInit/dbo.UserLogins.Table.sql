USE [Makai]
GO
/****** Object:  Table [dbo].[UserLogins]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserLogins](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[IPAddress] [nvarchar](50) NOT NULL,
	[DateLoggedIn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_LogUserLogin] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[UserLogins] ADD  CONSTRAINT [DF_LogUserLogin_DateLoggedIn]  DEFAULT (getutcdate()) FOR [DateLoggedIn]
GO
ALTER TABLE [dbo].[UserLogins]  WITH CHECK ADD  CONSTRAINT [FK_UserLogins_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[UserLogins] CHECK CONSTRAINT [FK_UserLogins_Users]
GO
