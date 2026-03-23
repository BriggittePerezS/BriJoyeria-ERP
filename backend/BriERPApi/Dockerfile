# Imagen base de .NET 8 para correr la app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Imagen para compilar el código
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["BriERPApi.csproj", "."]
RUN dotnet restore "./BriERPApi.csproj"
COPY . .
RUN dotnet build "BriERPApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BriERPApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Imagen final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Copiamos también la base de datos para que viaje con la app
COPY joyeria.db . 

ENTRYPOINT ["dotnet", "BriERPApi.dll"]