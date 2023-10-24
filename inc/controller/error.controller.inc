<?php

namespace Controller;

/**
 * Контроллер ошибок
 */
class ErrorController extends CommonController
{
	public function notFound()
	{
		echo '<h1>Page is not found</h1>';
	}

	public function internalServerError()
	{
		echo '<h1>Internal Server Error</h1>';
	}
}
