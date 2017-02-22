from mod import MOD
from loaders.gene_loader import GeneLoader
from files import *

class Human(MOD):
	species = "Homo sapiens"

	@staticmethod
	def gene_href(gene_id):
		return "http://www.genenames.org/cgi-bin/gene_symbol_report?hgnc_id=" + gene_id

	@staticmethod
	def get_organism_names():
		return ["Homo sapiens", "H. sapiens", "HUMAN"]

	@staticmethod
	def gene_id_from_panther(panther_id):
		# example: HGNC=974
		return panther_id.replace("=", ":")

	def load_genes(self):
		path = "tmp"
		S3File("mod-datadumps", "RGD_0.3_1.tar.gz", path).download()
		TARFile(path, "RGD_0.3_1.tar.gz").extract_all()
		return GeneLoader(path + "/agr/RGD_0.3_basicGeneInformation.9606.json").get_data()

	def load_go(self):
		list = []
		return list

	def load_diseases(self):
		list = []
		return list