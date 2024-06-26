﻿using System.Net;
using Microsoft.AspNetCore.Mvc;
using stock_flow.Controllers.Requests;
using stock_flow.Controllers.Responses;
using stock_flow.Enums;
using stock_flow.Models;
using stock_flow.Services;

namespace stock_flow.Controllers
{
    [ApiController]
    [Route("api/v1/autenticacao")]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        [Route("roles")]
        public async Task<IActionResult> Role([FromBody] RoleRequest request)
        {
            try
            {
                var role = new ApplicationRole
                {
                    Name = request.Role,
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                };

                await _authService.RoleAsync(role);

                return Ok(new AuthResponse
                {
                    Sucesso = true,
                    Mensagem = "Role cadastrada com sucesso"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new AuthResponse
                {
                    Sucesso = false,
                    Mensagem = "Um erro ocorreu: " + ex.Message
                });
            }
        }


        [HttpPost]
        [Route("cadastro")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var user = new ApplicationUser
                {
                    Email = request.Email,
                    UserName = request.Email,
                    FullName = request.Nome,
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                };

                await _authService.RegisterAsync(user, request.Senha);

                await _authService.AddRoleUserAsync(user,
                    string.IsNullOrEmpty(request.Role) ? UserRoles.USER.ToString() : request.Role);

                var result = await _authService.LoginAsync(request.Email, request.Senha);

                return Ok(new LoginResponse()
                {
                    Sucesso = true,
                    Mensagem = "Usuário cadastrado com sucesso",
                    AccessToken = result.AccessToken,
                    Email = result.Email,
                    UserId = result.UserId
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new AuthResponse
                {
                    Sucesso = false,
                    Mensagem = "Um erro ocorreu: " + ex.Message
                });
            }
        }


        [HttpPost]
        [Route("login")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(LoginResponse))]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var result = await _authService.LoginAsync(request.Email, request.Senha);

                var response = new LoginResponse
                {
                    Sucesso = true,
                    Mensagem = "Login com sucesso",
                    AccessToken = result.AccessToken,
                    Email = result.Email,
                    UserId = result.UserId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new LoginResponse
                {
                    Sucesso = false,
                    Mensagem = "Um erro ocorreu: " + ex.Message
                });
            }
        }
    }
}