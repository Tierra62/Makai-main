USE [Makai]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 5/10/2023 10:00:13 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[Phone] [nvarchar](50) NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[Mi] [nvarchar](2) NULL,
	[AvatarUrl] [nvarchar](255) NULL,
	[Password] [nvarchar](100) NOT NULL,
	[DOB] [datetime2](7) NOT NULL,
	[IsConfirmed] [bit] NOT NULL,
	[StatusId] [int] NOT NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateModified] [datetime2](7) NOT NULL,
	[Is2FA] [bit] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_IsConfirmed]  DEFAULT ((0)) FOR [IsConfirmed]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_StatusId]  DEFAULT ((1)) FOR [StatusId]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_DateCreated]  DEFAULT (getutcdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_DateModified]  DEFAULT (getutcdate()) FOR [DateModified]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_Is2FA]  DEFAULT ((0)) FOR [Is2FA]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_StatusTypes] FOREIGN KEY([StatusId])
REFERENCES [dbo].[StatusTypes] ([Id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_StatusTypes]
GO
