<?php

require_once 'vendor/autoload.php';

use Twig\Extension\AbstractExtension;

/**
 * Extension for twig template engine
 *
 * Used to automatically set paths to Assets static files for the frontend.
 * Used for long term caching static files for the frontend.
 *
 * @example {{ webpackAsset('vendor.js') }}
 *
 * @property string  $manifestFilepath  Path to the frontend asset description file.
 * @property string  $pathPrefix        Path prefix add befora.
 *
 * @package livemaster/webpackAssets
 * @author  Ilya Reshetnikov, Denis Logvinov
 * @version 1.1, 20.03.2020
 */
class TwigExtensionWebpackAsset extends AbstractExtension
{
	/** @var string  $manifestData stores data from frontend asset description file */
	protected $manifestData = null;

	protected $pathPrefix = '';

	const EXTENSION_NAME = 'webpackAsset';

	/** class constructor define properties for class*/
	public function __construct($pathPrefix = 'dist', $useCdn = false) {
		$this->pathPrefix = $pathPrefix;
		$this->useCdn = $useCdn;
	}

	/**
	 * Return extension name
	 *
	 * @author Ilya Reshetnikov <ireshetnikov@livemaster.ru>
	 * @version 1.0, 25.08.2017
	 *
	 * @return string
	 */
	public function getName() {
		return sprintf('livemaster/%s', self::EXTENSION_NAME);
	}

	/**
	 * @ignore
	 *
	 * Callback for Twig
	 *
	 * @author  Ilya Reshetnikov, Denis Logvinov
	 * @version 1.0, 25.08.2017
	 *
	 * @return array
	 */
	public function getFunctions()
	{
		return [
			new \Twig\TwigFunction(self::EXTENSION_NAME, [$this, 'getWebpackAsset']),
		];
	}

	/**
	 * Loads and converts into an array a static description file for the frontend.
	 *
	 * @author  Ilya Reshetnikov <ireshetnikov@livemaster.ru>
	 * @version 1.0, 25.08.2017
	 *
	 * @param  string $manifestFilepath - Path to the frontend asset description file
	 *
	 * @return array
	 * @throws Exception - if the file in the specified path does not exist.
	 */
	protected function loadManifest($manifestFilepath)
	{
		if (!file_exists($manifestFilepath)) {
			throw new Exception('You need set right path to manifest.json');
		}

		return json_decode(file_get_contents($manifestFilepath), true);
	}

	/**
	 * Reads from the array of asets and returns the path to the aset
	 * or the name passed in the parameter.
	 *
	 * @author Ilya Reshetnikov <ireshetnikov@livemaster.ru>
	 * @version 1.0, 25.08.2017
	 *
	 * @return string
	 */
	public function getWebpackAsset($assetName, $outputPath = 'dist')
	{
		$pathPrefix = $outputPath ?: $this->pathPrefix;
		$manifestFilepath = ROOT_PATH . $pathPrefix . '/manifest.json';

		if (
			$this->manifestData === null
			|| $this->pathPrefix !== $pathPrefix
		) {
			try {
				$this->manifestData = $this->loadManifest($manifestFilepath);
				$this->pathPrefix = $pathPrefix;
			} catch(Exception $error) {
				$errorMessage =  $error->getMessage() . ' in ' . $error->getTraceAsString();
				trigger_error($errorMessage, E_USER_ERROR);
			}
		}

		$keyIsExist = array_key_exists($assetName, $this->manifestData);
		if ($keyIsExist) {
			if ($this->manifestData['version'] && $this->_checkRehashPossibility($assetName)) {
				$assetPath = $this->manifestData[$assetName] . '?' . $this->manifestData['version'];
			} else {
				$assetPath = $this->manifestData[$assetName];
			}
		} else {
			$assetPath = $assetName;
		}

		if ($this->useCdn) {
			$assetPath = 'https://static.livemaster.ru' . $assetPath;
		}

		return $assetPath;
	}

	/**
	 * Обработка исключений для автоматического перекеширования
	 *
	 * @author Dmitry Evtushenko
	 * @version 1.0, 24.04.2019
	 *
	 * @param string $assetName Ссылка на файл статики в /dist/manifest.json
	 * @return bool
	 */
	private function _checkRehashPossibility($assetName)
	{
		if (strpos($assetName, 'viewer/') === false && strpos($assetName, 'ap-image-zoom/') === false && $assetName !== 'hammer.min.js' && $assetName !== 'jquery.mousewheel.min.js') {
			return true;
		}
		return false;
	}
}